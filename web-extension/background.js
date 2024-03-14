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
// import { captureException } from '@sentry/browser'
// import { setupSentry } from './lib/sentry.js'

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

// setupSentry(settings, wallets)

const onerror = (...args) => {
  console.error(args)
  // captureException(args[0])
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
  onconnect: async (context) => {
    // Auto connect if origin is already approved (what we internally call connected)
    context.isConnected = await connections.has(context.origin)
    await connections.touch(context.origin)
  },
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
  server,
  onerror
})

connections.on('delete', ({ origin }) => {
  clientPorts.broadcast(origin, {
    jsonrpc: '2.0',
    method: 'client.disconnected',
    params: null
  })
  // TODO @emil to review as this doesn't seem like the correct place to do this
  for (const [, context] of clientPorts.ports.entries()) {
    if (context.origin === origin || context.origin === '*') {
      context.isConnected = false
    }
  }
})

wallets.on('create_key', async () => {
  const ports = clientPorts.ports.entries()
  for (const [port, context] of ports) {
    const allowedKeys = await connections.listAllowedKeys(context.origin)
    if (allowedKeys.length !== 0) {
      port.postMessage({
        jsonrpc: '2.0',
        method: 'client.accounts_changed',
        params: {
          keys: allowedKeys
        }
      })
    }
  }
})

wallets.on('rename_key', async () => {
  const ports = clientPorts.ports.entries()
  for (const [port, context] of ports) {
    const allowedKeys = await connections.listAllowedKeys(context.origin)
    if (allowedKeys.length !== 0) {
      port.postMessage({
        jsonrpc: '2.0',
        method: 'client.accounts_changed',
        params: {
          keys: allowedKeys
        }
      })
    }
  }
})

setupListeners(runtime, networks, settings, clientPorts, popupPorts, interactor, connections)

async function setPending() {
  const pending = interactor.totalPending()

  // Early return as there is not much else to do
  if (pending === 0) {
    action.setBadgeText({ text: '' })
    return
  }

  try {
    if (pending > 0 && popupPorts.ports.size < 1 && (await settings.get('autoOpen'))) {
      await createNotificationWindow()
    }
  } catch (_) {}

  action.setBadgeText({
    text: pending.toString()
  })
}
