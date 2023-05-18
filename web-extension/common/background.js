import { NetworkCollection } from './backend/network.js'
import { WalletCollection } from './backend/wallets.js'
import { ConnectionsCollection } from './backend/connections.js'
import { PortServer } from './lib/port-server.js'
import { PopupClient } from './backend/popup-client.js'

import JSONRPCServer from './lib/json-rpc-server.js'
import StorageLocalMap from './lib/storage.js'
import ConcurrentStorage from './lib/concurrent-storage.js'
import EncryptedStorage from './lib/encrypted-storage.js'
import initAdmin from './backend/admin-ns.js'
import initClient from './backend/client-ns.js'

const runtime = globalThis.browser?.runtime ?? globalThis.chrome?.runtime
const action = globalThis.browser?.browserAction ?? globalThis.chrome?.action

const interactor = new PopupClient()

const encryptedStore = new EncryptedStorage(new ConcurrentStorage(new StorageLocalMap('wallets')))
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
  onbeforerequest: setPending,
  onafterrequest: setPending,
  onerror(err) {
    console.error(err)
  },
  server: clientServer
})

const server = initAdmin({
  encryptedStore,
  settings,
  wallets,
  networks,
  onerror: (...args) => console.error(args)
})

const popupPorts = new PortServer({
  server
})

runtime.onConnect.addListener(async (port) => {
  if (port.name === 'content-script') return clientPorts.listen(port)
  if (port.name === 'popup') {
    popupPorts.listen(port)
    interactor.connect(port)
  }
})

runtime.onInstalled.addListener(async (details) => {
  await StorageLocalMap.permanentClearAll()

  await Promise.allSettled([
    networks.set('fairground', {
      name: 'Fairground',
      rest: ['https://api.n06.testnet.vega.xyz', 'https://api.n07.testnet.vega.xyz'],
      explorer: 'https://explorer.fairground.wtf/'
    }),
    settings.set('selectedNetwork', 'fairground')
  ])
})

function setPending() {
  const pending = clientPorts.totalPending()
  action.setBadgeText({
    text: pending === 0 ? '' : pending.toString()
  })
}

function doValidate(validator, params) {
  if (!validator(params))
    throw new JSONRPCServer.Error(
      validator.errors[0].message,
      1,
      validator.errors.map((e) => e.message)
    )
}
