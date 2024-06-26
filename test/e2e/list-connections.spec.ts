import { WebDriver } from 'selenium-webdriver'
import { captureScreenshot } from './helpers/driver'
import { NavPanel } from './page-objects/navpanel'
import { VegaAPI } from './helpers/wallet/vega-api'
import { ConnectWallet } from './page-objects/connect-wallet'
import { ListConnections } from './page-objects/list-connections'
import { createWalletAndDriver } from './helpers/wallet/wallet-setup'
import { staticWait, switchWindowHandles } from './helpers/selenium-util'

const transferReq = {
  fromAccountType: 4,
  toAccountType: 4,
  amount: '1',
  asset: 'fc7fd956078fb1fc9db5c19b88f0874c4299b2a7639ad05a47a28c0aef291b55',
  to: 'fc7fd956078fb1fc9db5c19b88f0874c4299b2a7639ad05a47a28c0aef291b55',
  kind: {
    oneOff: {}
  }
}

describe('list connections tests', () => {
  let driver: WebDriver
  let navPanel: NavPanel
  let connections: ListConnections
  let firstDapp: VegaAPI
  let secondDapp: VegaAPI
  let connectWalletModal: ConnectWallet

  beforeEach(async () => {
    driver = await createWalletAndDriver()
    navPanel = new NavPanel(driver)
    firstDapp = new VegaAPI(driver)
    secondDapp = new VegaAPI(driver, 'https://vega.xyz')
    connectWalletModal = new ConnectWallet(driver)

    connections = await navPanel.goToListConnections()
    await connections.checkNoConnectionsExist()
  })

  afterEach(async () => {
    await captureScreenshot(driver, expect.getState().currentTestName as string)
    await driver.quit()
  })

  it('shows no connections when no dapp connected, updates and shows connections after approving one or more', async () => {
    // 1109-VCON-001 I can see which dapps have permission to access my keys
    // 1109-VCON-008 If I have the extension open on the Connections view AND I approve a request to connect to a dapp (and the connection is successful), the connections view should update to show the new connection
    await firstDapp.connectWallet()
    await connectWalletModal.approveConnectionAndCheckSuccess()
    await connections.checkNumConnections(1)
    let connectionNames = await connections.getConnectionNames()
    expect(connectionNames[0]).toContain('https://vegaprotocol')

    await secondDapp.connectWallet()
    await connectWalletModal.approveConnectionAndCheckSuccess()
    await connections.checkNumConnections(2)

    connectionNames = await connections.getConnectionNames()
    expect(
      connectionNames.some((name) => name.includes('https://vegaprotocol')),
      'expected the example dapp be present'
    ).toBe(true)
    expect(
      connectionNames.some((name) => name.includes('vega.xyz')),
      'expected vega.xyz to be present'
    ).toBe(true)
  })

  it('allows disconnecting of a dapp, check disconnected dapps cannot send a transaction without reconnecting', async () => {
    // 1109-VCON-006 I can choose to disconnect a dapp connection (and it's pre-approved status i.e. the next time I want to connect the dapp I am asked to approve the connection)
    // 1137-CLNT-013 If I connect and the user disconnects via the UI, an event is sent to all listeners
    const extensionHandle = await driver.getWindowHandle()
    await firstDapp.connectWallet(true, false, false)
    const firstDappWindowHandle = await driver.getWindowHandle()
    await firstDapp.addEventListener('client.disconnected')
    await connectWalletModal.approveConnectionAndCheckSuccess()
    await connections.checkNumConnections(1)

    await secondDapp.connectWallet(true, false, false)
    const secondDappWindowHandle = await driver.getWindowHandle()
    await secondDapp.addEventListener('client.disconnected')
    await connectWalletModal.approveConnectionAndCheckSuccess()
    await connections.checkNumConnections(2)

    const keys = await firstDapp.listKeys()

    await connections.disconnectConnection('https://vegaprotocol.github.io')
    await staticWait(10000)
    await switchWindowHandles(driver, false, firstDappWindowHandle)
    await staticWait(10000)
    const { callCounter: firstDappCallCounter } = await firstDapp.getEventResult('client.disconnected')
    expect(firstDappCallCounter).toEqual(1)

    await switchWindowHandles(driver, false, extensionHandle)
    await connections.checkNumConnections(1)
    let connectionNames = await connections.getConnectionNames()
    expect(connectionNames[0]).toContain('https://vega.xyz')

    await switchWindowHandles(driver, false, firstDappWindowHandle)
    await firstDapp.sendTransaction(keys[0].publicKey, { transfer: transferReq })
    const res = await firstDapp.getTransactionResult()
    expect(res).toBe('Not connected')

    await firstDapp.driver.navigate().refresh()
    await firstDapp.connectWallet(false)
    await switchWindowHandles(driver, false, extensionHandle)
    await connectWalletModal.checkOnConnectWallet()
    await connectWalletModal.denyConnection()

    await switchWindowHandles(driver, false, secondDappWindowHandle)
    const { callCounter: secondDappCallCounter } = await secondDapp.getEventResult('client.disconnected')
    expect(secondDappCallCounter).toEqual(0)

    await secondDapp.driver.navigate().refresh()
    await secondDapp.connectWallet(false)
    await switchWindowHandles(driver, false, extensionHandle)
    await connections.checkOnListConnectionsPage()

    await firstDapp.removeEventListener('client.disconnected')
    await secondDapp.removeEventListener('client.disconnected')
  })

  it('disconnects all instances of a dapp when I have more than one instance when I click disconnect', async () => {
    secondDapp = new VegaAPI(driver)
    await firstDapp.connectWallet()
    await firstDapp.addEventListener('client.disconnected')
    await connectWalletModal.approveConnectionAndCheckSuccess()
    await connections.checkOnListConnectionsPage()
    await connections.checkNumConnections(1)

    await secondDapp.connectWallet()
    await secondDapp.addEventListener('client.disconnected')
    await connections.checkOnListConnectionsPage()
    await connections.checkNumConnections(1)

    await connections.disconnectConnection('https://vegaprotocol.github.io')
    expect(await connections.connectionsExist()).toBe(false)

    const { callCounter: firstDappCallCounter } = await firstDapp.getEventResult('client.disconnected')
    expect(firstDappCallCounter).toEqual(1)
    await firstDapp.driver.navigate().refresh()
    await firstDapp.connectWallet(false)

    await connectWalletModal.checkOnConnectWallet()
    await connectWalletModal.denyConnection()

    const { callCounter: secondDappCallCounter } = await secondDapp.getEventResult('client.disconnected')
    expect(secondDappCallCounter).toEqual(1)
    await secondDapp.driver.navigate().refresh()
    await secondDapp.connectWallet(false)
    await connectWalletModal.checkOnConnectWallet()

    await firstDapp.removeEventListener('client.disconnected')
    await secondDapp.removeEventListener('client.disconnected')
  })
})
