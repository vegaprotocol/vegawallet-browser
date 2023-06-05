import { WebDriver } from 'selenium-webdriver'
import { captureScreenshot, initDriver } from './driver'
import { ViewWallet } from './page-objects/view-wallet'
import { navigateToLandingPage } from './wallet-helpers/common'
import { APIHelper } from './wallet-helpers/api-helpers'
import { NavPanel } from './page-objects/navpanel'
import { VegaAPI } from './wallet-helpers/vega-api'
import { ConnectWallet } from './page-objects/connect-wallet'

describe('view connections tests', () => {
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

  it('shows no connections when no dapp connected, updates and shows connections after approving one', async () => {
    //  When I have no connections I can see that and still see instructions on how to connect to a Vega dapp
    // I can see which dapps have permission to access my keys
    const connections = await navPanel.goToConnections()
    await connections.checkNoConnectionsExist()
    const vegaAPI = new VegaAPI(driver)
    await vegaAPI.connectWallet()
    const connectWalletModal = new ConnectWallet(driver)
    await connectWalletModal.approveConnectionAndCheckSuccess()
    const numConnections = await connections.getNumberOfConnections()
    expect(
      numConnections,
      `expected a connection to be present after approving, found ${numConnections} connection(s)`
    ).toBe(1)
  })
})
