import { WebDriver } from 'selenium-webdriver'
import { captureScreenshot, initDriver } from './driver'
import { ViewWallet } from './page-objects/view-wallet'
import { navigateToLandingPage } from './wallet-helpers/common'
import { APIHelper } from './wallet-helpers/api-helpers'
import { NavPanel } from './page-objects/navpanel'
import { VegaAPI } from './wallet-helpers/vega-api'
import { ConnectWallet } from './page-objects/connect-wallet'

describe('list connections tests', () => {
  let driver: WebDriver
  let viewWallet: ViewWallet
  let navPanel: NavPanel

  beforeEach(async () => {
    driver = await initDriver()
    viewWallet = new ViewWallet(driver)
    await navigateToLandingPage(driver)
    navPanel = new NavPanel(driver)
    const apiHelper = new APIHelper(driver)
    await apiHelper.setUpWalletAndKey()
    await navigateToLandingPage(driver)
  })

  afterEach(async () => {
    await captureScreenshot(driver, expect.getState().currentTestName as string)
    await driver.quit()
  })

  it('shows no connections when no dapp connected, updates and shows connections after approving one or more', async () => {
    // 1101-BWAL-075 I can see which dapps have permission to access my keys
    // 1101-BWAL-082 If I have the extension open on the Connections view AND I approve a request to connect to a dapp (and the connection is successful), the connections view should update to show the new connection
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
})
