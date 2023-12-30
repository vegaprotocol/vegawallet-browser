import { createWindow } from '../backend/windows.js'
import config from '!/config'

export const createConnectionHandler = (clientPorts, popupPorts, interactor) => async (port) => {
  if (port.name === 'content-script') return clientPorts.listen(port)
  if (port.name === 'popup') {
    popupPorts.listen(port)
    interactor.connect(port)
  }
}

export const createOnInstalledListener = (networks, settings, connections) => async (details) => {
  const { reason } = details
  if (reason === 'install') {
    await install({ networks, settings })

    if (config.autoOpenOnInstall) {
      createWindow()
    }
  }

  if (reason === 'update') {
    await update({ settings, networks, connections })
  }
}

export async function install ({ networks, settings }) {
  await Promise.allSettled([
    ...config.networks.map((network) => networks.set(network.id, network)),
    settings.set('selectedNetwork', config.defaultNetworkId),
    settings.set('autoOpen', true),
    settings.set('version', migrations.length)
  ])
}

const migrations = [
  // The first migration is due to the introduction of autoOpen in 0.11.0,
  // however, we failed to test updates in CI.
  async function v1 ({ settings }) {
    await settings.transaction(async (store) => {
      if (await store.get('autoOpen') == null) await store.set('autoOpen', true)

      await store.set('version', 1)
    })
  },

  // The second migration is modifying the network structure,
  // introducing a fixed chainId, and tying a connection to a specific
  // chainId (with a preferred networkId).
  async function v2 ({ settings, networks, connections }) {
    await settings.transaction(async (store) => {
      const defaultNetworkId = config.defaultNetworkId
      const defaultChainId = config.defaultChainId

      await store.set('selectedNetwork', defaultNetworkId)

      // populate all networks
      await networks.store.clear()
      for (const network of config.networks) {
        await networks.set(network.id, network)
      }

      // update all connections to have default values for chainId and networkId
      for (const [origin, connection] of await connections.store.entries()) {
        connection.chainId = defaultChainId
        connection.networkId = defaultNetworkId

        await connections.store.set(origin, connection)
      }

      await store.set('version', 2)
    })
  }
]

// Migration function, add more dependencies as needed for migrations
export async function update (stores) {
  const previousVersion = await stores.settings.get('version') ?? 0

  for (let i = previousVersion; i < migrations.length; i++) {
    await migrations[i](stores)
  }
}

export const setupListeners = (runtime, networks, settings, clientPorts, popupPorts, interactor, connections) => {
  const installListener = createOnInstalledListener(networks, settings, connections)
  runtime.onInstalled.addListener(installListener)

  const connectionListener = createConnectionHandler(clientPorts, popupPorts, interactor)
  runtime.onConnect.addListener(connectionListener)
}
