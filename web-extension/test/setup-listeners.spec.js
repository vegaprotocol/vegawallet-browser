import {
  createConnectionHandler,
  createOnInstalledListener,
  setupListeners,
  update,
  install
} from '../lib/setup-listeners.js'
import ConcurrentStorage from '../lib/concurrent-storage.js'
import config from '!/config'
import { NetworkCollection } from '../backend/network.js'
import { fairground, testingNetwork, testingNetwork2 } from '../../config/well-known-networks.js'
import { ConnectionsCollection } from '../backend/connections.js'

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

    expect(networksMock.set).toHaveBeenCalledTimes(2)
    expect(networksMock.set).toHaveBeenCalledWith(testingNetwork.id, testingNetwork)
    expect(networksMock.set).toHaveBeenCalledWith(testingNetwork2.id, testingNetwork2)
    expect(settingsMock.set).toHaveBeenCalledTimes(3)
    expect(settingsMock.set).toHaveBeenCalledWith('selectedNetwork', testingNetwork.id)
    expect(settingsMock.set).toHaveBeenCalledWith('autoOpen', true)
    expect(settingsMock.set).toHaveBeenCalledWith('version', 3)
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

  it('should not apply migrations if installing', async () => {
    const settings = new ConcurrentStorage(new Map())
    const networks = new NetworkCollection(new Map())
    const connections = new ConnectionsCollection({ connectionsStore: new Map(), publicKeyIndexStore: new Map() })

    await install({ networks, settings })

    expect(await settings.get('version')).toBe(3)
    const clone = Array.from(await settings.entries())

    await update({ settings, connections })

    expect(Array.from(await settings.entries())).toEqual(clone)
  })

  it('should apply migrations from version null to version 1', async () => {
    const networks = new NetworkCollection(new Map())
    const settings = new ConcurrentStorage(
      new Map([
        ['version', null],
        ['autoOpen', null]
      ])
    )
    const connections = new ConnectionsCollection({ connectionsStore: new Map(), publicKeyIndexStore: new Map() })

    await update({ settings, networks, connections })

    expect(await settings.get('version')).toBe(3)
    expect(await settings.get('autoOpen')).toBe(true)
  })

  it('should apply migrations from version 0 to version 1', async () => {
    const networks = new NetworkCollection(new Map())
    const settings = new ConcurrentStorage(
      new Map([
        ['version', 0],
        ['autoOpen', null]
      ])
    )
    const connections = new ConnectionsCollection({ connectionsStore: new Map(), publicKeyIndexStore: new Map() })

    await update({ settings, networks, connections })

    expect(await settings.get('version')).toBe(3)
    expect(await settings.get('autoOpen')).toBe(true)
  })

  it('should not apply migration 1 if autoOpen is already set', async () => {
    const networks = new NetworkCollection(new Map())
    const settings = new ConcurrentStorage(
      new Map([
        ['version', 0],
        ['autoOpen', false]
      ])
    )
    const connections = new ConnectionsCollection({ connectionsStore: new Map(), publicKeyIndexStore: new Map() })

    await update({ settings, networks, connections })

    expect(await settings.get('version')).toBe(3)
    expect(await settings.get('autoOpen')).toBe(false)
  })

  // Add test for migration of networks
  it('should apply migrations from version 1 to version 2', async () => {
    const networks = new NetworkCollection(new Map([['something', fairground]]))
    const settings = new ConcurrentStorage(
      new Map([
        ['version', 1],
        ['autoOpen', true]
      ])
    )
    const connections = new ConnectionsCollection({ connectionsStore: new Map(), publicKeyIndexStore: new Map() })
    await connections.set('https://example.com', {
      allowList: {
        wallets: ['w1'],
        publicKeys: []
      },
      accessedAt: 0
    })
    await update({ settings, networks, connections })
    expect(await networks.list()).toStrictEqual(['test', 'test2'])
    expect(await connections.get('https://example.com')).toStrictEqual({
      allowList: {
        wallets: ['w1'],
        publicKeys: []
      },
      accessedAt: 0,
      origin: 'https://example.com',
      chainId: 'test-chain-id',
      networkId: 'test'
    })
  })
})
