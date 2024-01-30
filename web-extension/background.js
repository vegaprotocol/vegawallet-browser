import { NetworkCollection } from './backend/network.js'
import { WalletCollection } from './backend/wallets.js'
import { ConnectionsCollection } from './backend/connections.js'
import { PortServer } from '../lib/port-server.js'
import { PopupClient } from './backend/popup-client.js'
import { createNotificationWindow } from './backend/windows.js'
import { setupListeners } from './lib/setup-listeners.js'

import { StorageLocalMap, StorageSessionMap } from './lib/storage.js'
import ConcurrentStorage from './lib/concurrent-storage.js'
import EncryptedStorage from './lib/encrypted-storage.js'
import { FetchCache } from './backend/fetch-cache.js'

import initAdmin from './backend/admin-ns.js'
import initClient from './backend/client-ns.js'
import config from '!/config'
import { captureException } from '@sentry/browser'
import { setupSentry } from './lib/sentry.js'

const runtime = globalThis.browser?.runtime ?? globalThis.chrome?.runtime
const action = globalThis.browser?.browserAction ?? globalThis.chrome?.action

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

const fetchCache = new FetchCache(new StorageSessionMap('fetch-cache'))

setupSentry(settings, wallets)

const onerror = (...args) => {
  console.error(args)
  captureException(args[0])
}

const clientServer = initClient({
  settings,
  wallets,
  networks,
  connections,
  interactor,
  onerror
})

const clientPorts = new PortServer({
  onerror,
  server: clientServer
})

const server = initAdmin({
  encryptedStore,
  settings,
  wallets,
  networks,
  connections,
  fetchCache,
  onerror
})

const popupPorts = new PortServer({
  server
})

connections.listen((ev, connection) => {
  switch (ev) {
    case 'delete':
    case 'disconnect':
      clientPorts.disconnect(connection.origin)
      break
  }
})

setupListeners(runtime, networks, settings, clientPorts, popupPorts, interactor)

async function setPending () {
  const pending = interactor.totalPending()

  // Early return as there is not much else to do
  if (pending === 0) {
    action.setBadgeText({ text: '' })
    return
  }

  try {
    if (pending > 0 && popupPorts.ports.size < 1 && await settings.get('autoOpen')) {
      await createNotificationWindow()
    }
  } catch (_) { }

  action.setBadgeText({
    text: pending.toString()
  })
}
