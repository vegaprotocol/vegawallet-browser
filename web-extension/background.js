import { NetworkCollection } from './backend/network.js'
import { WalletCollection } from './backend/wallets.js'
import { ConnectionsCollection } from './backend/connections.js'
import { PortServer } from '../lib/port-server.js'
import { PopupClient } from './backend/popup-client.js'

import StorageLocalMap from './lib/storage.js'
import ConcurrentStorage from './lib/concurrent-storage.js'
import EncryptedStorage from './lib/encrypted-storage.js'
import initAdmin from './backend/admin-ns.js'
import initClient from './backend/client-ns.js'
import config from '!/config'

const runtime = globalThis.browser?.runtime ?? globalThis.chrome?.runtime
const action = globalThis.browser?.browserAction ?? globalThis.chrome?.action
const windows = globalThis.browser?.windows ?? globalThis.chrome?.windows

const interactor = new PopupClient({
  onbeforerequest: setPending,
  onafterrequest: setPending
})

const encryptedStore = new EncryptedStorage(
  new ConcurrentStorage(new StorageLocalMap('wallets')),
  config.encryptionSettings
)

const publicKeyIndexStore = new ConcurrentStorage(new StorageLocalMap('public-key-index'))

const settings = new ConcurrentStorage(new StorageLocalMap('settings'))
const wallets = new WalletCollection({
  walletsStore: encryptedStore,
  publicKeyIndexStore
})
const networks = new NetworkCollection(new ConcurrentStorage(new StorageLocalMap('networks')))
const connections = new ConnectionsCollection({
  connectionsStore: new ConcurrentStorage(new StorageLocalMap('connections')),
  publicKeyIndexStore
})
const clientServer = initClient({
  settings,
  wallets,
  networks,
  connections,
  interactor,
  onerror: (...args) => console.error(args)
})

const clientPorts = new PortServer({
  onerror(err) {
    console.error(err)
  },
  server: clientServer
})

const server = initAdmin({
  runtime,
  windows,
  encryptedStore,
  settings,
  wallets,
  networks,
  connections,
  onerror: (...args) => console.error(args)
})

const popupPorts = new PortServer({
  server
})

connections.listen((ev, connection) => {
  if (ev === 'delete') {
    clientPorts.disconnect(connection.origin)
  }
})

runtime.onConnect.addListener(async (port) => {
  if (port.name === 'content-script') return clientPorts.listen(port)
  if (port.name === 'popup') {
    popupPorts.listen(port)
    interactor.connect(port)
  }
})

runtime.onInstalled.addListener(async () => {
  const id = config.network.name.toLowerCase()
  await Promise.allSettled([
    networks.set(id, {
      name: config.network.name,
      rest: config.network.rest,
      explorer: config.network.explorer
    }),
    settings.set('selectedNetwork', id)
  ])
})

async function setPending() {
  const pending = interactor.totalPending()
  try {
    if (pending > 0 && popupPorts.ports.size < 1) {
      let left = 0
      let top = 0
      try {
        const lastFocused = await windows.getLastFocused()
        top = lastFocused.top
        left = lastFocused.left + (lastFocused.width - 360)
      } catch (_) {}

      await windows.create({
        url: runtime.getURL('/index.html?once=1'),
        type: 'popup',
        // Approximate dimension. The client figures out exactly how big it should be as this height/width
        // includes the frame and different OSes have different sizes
        width: 360,
        height: 600,
        top,
        left
      })
    }
  } catch (_) {}
  action.setBadgeText({
    text: pending === 0 ? '' : pending.toString()
  })
}
