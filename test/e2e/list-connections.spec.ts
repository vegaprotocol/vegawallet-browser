import { WebDriver } from 'selenium-webdriver'
import { captureScreenshot, initDriver } from './driver'
import { navigateToLandingPage } from './wallet-helpers/common'
import { APIHelper } from './wallet-helpers/api-helpers'
import { NavPanel } from './page-objects/navpanel'
import { VegaAPI } from './wallet-helpers/vega-api'
import { ConnectWallet } from './page-objects/connect-wallet'
import { openNewWindowAndSwitchToIt, staticWait } from './selenium-util'

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
  let connectWallet: ConnectWallet

  beforeEach(async () => {
    driver = await initDriver()
    await navigateToLandingPage(driver)
    navPanel = new NavPanel(driver)
    connectWallet = new ConnectWallet(driver)
    const apiHelper = new APIHelper(driver)
    await apiHelper.setUpWalletAndKey()
    await navigateToLandingPage(driver)
  })

  afterEach(async () => {
    await captureScreenshot(driver, expect.getState().currentTestName as string)
    //await driver.quit()
  })

  it('shows no connections when no dapp connected, updates and shows connections after approving one or more', async () => {
    // 1109-VCON-001 I can see which dapps have permission to access my keys
    // 1109-VCON-008 If I have the extension open on the Connections view AND I approve a request to connect to a dapp (and the connection is successful), the connections view should update to show the new connection
    const connections = await navPanel.goToListConnections()
    await connections.checkNoConnectionsExist()
    const windowHandle = await driver.getWindowHandle()
    const firstDapp = new VegaAPI(driver, windowHandle, 'https://vegaprotocol.github.io/vegawallet-browser/')
    await firstDapp.connectWallet()
    const connectWalletModal = new ConnectWallet(driver)
    await connectWalletModal.approveConnectionAndCheckSuccess()
    await connections.checkNumConnections(1)
    let connectionNames = await connections.getConnectionNames()
    expect(connectionNames[0]).toContain('https://vegaprotocol')

    const secondDapp = new VegaAPI(driver, await driver.getWindowHandle(), 'https://vega.xyz')
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

  it('allows disconnecting of a dapp', async () => {
    // TODO this opens 4 windows rather than reusing the same ones for dApp 1 and 2
    // this should be fixed
    // TODO open multiple instances of first dApp and ensure both are disconnected
    // 1109-VCON-006 I can choose to disconnect a dapp connection (and it's pre-approved status i.e. the next time I want to connect the dapp I am asked to approve the connection)
    const connections = await navPanel.goToListConnections()
    await connections.checkNoConnectionsExist()

    const firstDapp = new VegaAPI(driver, 'https://vegaprotocol.github.io/vegawallet-browser/')
    await firstDapp.connectWallet()
    const connectWalletModal = new ConnectWallet(driver)
    await connectWalletModal.approveConnectionAndCheckSuccess()

    const secondDapp = new VegaAPI(driver, 'https://vega.xyz')
    await secondDapp.connectWallet()
    await connectWalletModal.approveConnectionAndCheckSuccess()
    await connections.checkNumConnections(2)

    const keys = await firstDapp.listKeys()

    await connections.disconnectConnection('https://vegaprotocol.github.io')
    await connections.checkNumConnections(1)
    await staticWait(5000)
    let connectionNames = await connections.getConnectionNames()
    expect(connectionNames[0]).toContain('https://vega.xyz')
    await staticWait(5000)

    // Check that the disconnected dapp cannot send a transaction
    await firstDapp.sendTransaction(keys[0].publicKey, { transfer: transferReq })
    const res = await firstDapp.getTransactionResult()
    expect(res).toBe('Not connected')

    // Check the first dApp needs to reconnect
    // await firstDapp.connectWallet()
    // await connectWallet.checkOnConnectWallet()
    // await connectWallet.denyConnection()

    // // Check the second dApp does not need to reconnect
    // await secondDapp.connectWallet()
    // await connections.checkOnListConnectionsPage()
  })
})
