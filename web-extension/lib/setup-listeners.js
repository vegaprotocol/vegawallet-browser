import { createWindow } from '../backend/windows.js'
import config from '!/config'

export const createConnectionHandler = (clientPorts, popupPorts, interactor) => async (port) => {
  if (port.name === 'content-script') return clientPorts.listen(port)
  if (port.name === 'popup') {
    popupPorts.listen(port)
    interactor.connect(port)
  }
}

export const createOnInstalledListener = (networks, settings) => async (details) => {
  const { reason } = details
  if (reason === 'install') {
    const id = config.network.name.toLowerCase()
    await Promise.allSettled([
      networks.set(id, {
        name: config.network.name,
        rest: config.network.rest,
        explorer: config.network.explorer
      }),
      settings.set('selectedNetwork', id),
      settings.set('autoOpen', true),
      settings.set('version', migrations.length)
    ])

    if (config.autoOpenOnInstall) {
      createWindow()
    }
  }

  if (reason === 'update') {
    const previousVersion = await settings.get('version') ?? 0

    for (let i = previousVersion; i < migrations.length; i++) {
      await migrations[i](settings)
    }
  }
}

const migrations = [
  // The first migration is due to the introduction of autoOpen in 0.11.0,
  // however, we failed to test updates in CI.
  async function v1 (settings) {
    await settings.transaction(async (store) => {
      if (await store.get('autoOpen') == null) await store.set('autoOpen', true)

      await store.set('version', 1)
    })
  }
]

export const setupListeners = (runtime, networks, settings, clientPorts, popupPorts, interactor) => {
  const installListener = createOnInstalledListener(networks, settings)
  runtime.onInstalled.addListener(installListener)

  const connectionListener = createConnectionHandler(clientPorts, popupPorts, interactor)
  runtime.onConnect.addListener(connectionListener)
}
