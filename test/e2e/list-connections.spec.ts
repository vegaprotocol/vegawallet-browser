import { WebDriver } from 'selenium-webdriver'
import { captureScreenshot, initDriver } from './driver'
import { navigateToLandingPage } from './wallet-helpers/common'
import { APIHelper } from './wallet-helpers/api-helpers'
import { NavPanel } from './page-objects/navpanel'
import { VegaAPI } from './wallet-helpers/vega-api'
import { ConnectWallet } from './page-objects/connect-wallet'
import { ListConnections } from './page-objects/list-connections'

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
    console.log('instantiating')
    driver = await initDriver()
    console.log('instantiated driver')
    navPanel = new NavPanel(driver)
    const apiHelper = new APIHelper(driver)
    firstDapp = new VegaAPI(driver)
    console.log('set up first dapp')
    secondDapp = new VegaAPI(driver, 'https://vega.xyz')
    console.log('set up second dapp')
    connectWalletModal = new ConnectWallet(driver)

    await navigateToLandingPage(driver)
    console.log('navigated to landing page')
    await apiHelper.setUpWalletAndKey()
    console.log('set up wallet and key')
    await navigateToLandingPage(driver)
    console.log('navigated to landing page after the')
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
    await firstDapp.connectWallet()
    await connectWalletModal.approveConnectionAndCheckSuccess()

    await secondDapp.connectWallet()
    await connectWalletModal.approveConnectionAndCheckSuccess()
    await connections.checkNumConnections(2)

    const keys = await firstDapp.listKeys()

    await connections.disconnectConnection('https://vegaprotocol.github.io')
    await connections.checkNumConnections(1)
    let connectionNames = await connections.getConnectionNames()
    expect(connectionNames[0]).toContain('https://vega.xyz')

    await firstDapp.sendTransaction(keys[0].publicKey, { transfer: transferReq })
    const res = await firstDapp.getTransactionResult()
    expect(res).toBe('Not connected')

    await firstDapp.connectWallet(false)
    await connectWalletModal.checkOnConnectWallet()
    await connectWalletModal.denyConnection()

    await secondDapp.connectWallet(false)
    await connections.checkOnListConnectionsPage()
  })

  it('disconnects all instances of a dapp when I have more than one instance when I click disonnect', async () => {
    secondDapp = new VegaAPI(driver)
    await firstDapp.connectWallet()
    await connectWalletModal.approveConnectionAndCheckSuccess()
    console.log('first dapp connected')

    await secondDapp.connectWallet()
    console.log('second dapp connected')
    await connections.checkOnListConnectionsPage()
    await connections.checkNumConnections(1)
    console.log('checked num connections')

    await connections.disconnectConnection('https://vegaprotocol.github.io')
    expect(await connections.connectionsExist()).toBe(false)

    await firstDapp.connectWallet(false)
    await connectWalletModal.checkOnConnectWallet()
    await connectWalletModal.denyConnection()

    await secondDapp.connectWallet(false)
    await connectWalletModal.checkOnConnectWallet()
  })
})
