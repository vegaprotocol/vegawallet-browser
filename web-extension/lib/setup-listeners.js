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
      })
    ])
    await settings.set('selectedNetwork', id)
    await settings.set('autoOpen', true)
    if (config.autoOpenOnInstall) {
      createWindow()
    }
  }
}
export const setupListeners = (runtime, networks, settings, clientPorts, popupPorts, interactor) => {
  const installListener = createOnInstalledListener(networks, settings)
  runtime.onInstalled.addListener(installListener)

  const connectionListener = createConnectionHandler(clientPorts, popupPorts, interactor)
  runtime.onConnect.addListener(connectionListener)
}
