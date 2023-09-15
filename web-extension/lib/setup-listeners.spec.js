import { createConnectionHandler, createOnInstalledListener, setupListeners } from './setup-listeners.js'
import config from '!/config'

describe('SetupListeners', () => {
  beforeEach(() => {
    jest.resetAllMocks()
  })
  it('should call clientPorts.listen when port name is "content-script"', () => {
    const clientPortsMock = { listen: jest.fn() }
    const popupPortsMock = { listen: jest.fn() }
    const interactorMock = { connect: jest.fn() }
    const portMock = { name: 'content-script' }

    const connectionHandler = createConnectionHandler(clientPortsMock, popupPortsMock, interactorMock)
    connectionHandler(portMock)

    expect(clientPortsMock.listen).toHaveBeenCalledTimes(1)
    expect(clientPortsMock.listen).toHaveBeenCalledWith(portMock)
  })

  it('should call popupPorts.listen and interactor.connect when port name is "popup"', () => {
    const clientPortsMock = { listen: jest.fn() }
    const popupPortsMock = { listen: jest.fn() }
    const interactorMock = { connect: jest.fn() }
    const portMock = { name: 'popup' }

    const connectionHandler = createConnectionHandler(clientPortsMock, popupPortsMock, interactorMock)
    connectionHandler(portMock)

    expect(popupPortsMock.listen).toHaveBeenCalledTimes(1)
    expect(popupPortsMock.listen).toHaveBeenCalledWith(portMock)
    expect(interactorMock.connect).toHaveBeenCalledTimes(1)
    expect(interactorMock.connect).toHaveBeenCalledWith(portMock)
  })

  it('should set networks and selectedNetwork when reason is "install"', async () => {
    const networksMock = { set: jest.fn() }
    const settingsMock = { set: jest.fn() }
    const detailsMock = { reason: 'install' }

    const onInstalledListener = createOnInstalledListener(networksMock, settingsMock)
    await onInstalledListener(detailsMock)

    expect(networksMock.set).toHaveBeenCalledTimes(1)
    expect(networksMock.set).toHaveBeenCalledWith('test', {
      explorer: 'https://explorer.fairground.wtf',
      name: 'Test',
      rest: ['http://localhost:9090']
    })
    expect(settingsMock.set).toHaveBeenCalledTimes(1)
    expect(settingsMock.set).toHaveBeenCalledWith('selectedNetwork', 'test')
  })

  it('should create a window if autoOpenOnInstall is true', async () => {
    // 1113-POPT-009 The browser wallet opens in a pop-up window when the extension is installed
    const networksMock = { set: jest.fn() }
    const settingsMock = { set: jest.fn() }
    const detailsMock = { reason: 'install' }

    config.autoOpenOnInstall = true

    const onInstalledListener = createOnInstalledListener(networksMock, settingsMock)
    await onInstalledListener(detailsMock)

    expect(global.browser.windows.create).toHaveBeenCalledTimes(1)
  })

  it('should not create a window if reason is not install', async () => {
    const networksMock = { set: jest.fn() }
    const settingsMock = { set: jest.fn() }
    const detailsMock = { reason: 'some-other-reason' }

    config.autoOpenOnInstall = true

    const onInstalledListener = createOnInstalledListener(networksMock, settingsMock)
    await onInstalledListener(detailsMock)

    expect(global.browser.windows.create).toHaveBeenCalledTimes(0)
  })

  it('should add event listeners using createOnInstalledListener and createConnectionHandler', () => {
    const runtimeMock = {
      onInstalled: { addListener: jest.fn() },
      onConnect: { addListener: jest.fn() }
    }
    const networksMock = {}
    const settingsMock = {}
    const clientPortsMock = {}
    const popupPortsMock = {}
    const interactorMock = {}

    setupListeners(runtimeMock, networksMock, settingsMock, clientPortsMock, popupPortsMock, interactorMock)

    expect(runtimeMock.onInstalled.addListener).toHaveBeenCalledTimes(1)
    expect(runtimeMock.onInstalled.addListener).toHaveBeenCalledWith(expect.any(Function))

    expect(runtimeMock.onConnect.addListener).toHaveBeenCalledTimes(1)
    expect(runtimeMock.onConnect.addListener).toHaveBeenCalledWith(expect.any(Function))
  })
})
