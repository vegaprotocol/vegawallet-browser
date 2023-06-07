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
    //await driver.quit()
  })

  it('shows no connections when no dapp connected, updates and shows connections after approving one', async () => {
    // 1101-BWAL-076 I can see which dapps have permission to access my keys
    // 1101-BWAL-083 If I have the extension open on the Connections view AND I approve a request to connect to a dapp (and the connection is successful), the connections view should update to show the new connection
    const connections = await navPanel.goToListConnections()
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
    // assert on the connection name
  })

  it('can disconnect from a dap via the wallet', async () => {
    // 1101-BWAL-081 I can choose to disconnect a dapp connection (and it's pre-approved status i.e. the next time I want to connect the dapp I am asked to approve the connection)
    const vegaAPI = new VegaAPI(driver)
    await vegaAPI.connectWallet()
    const connectWalletModal = new ConnectWallet(driver)
    await connectWalletModal.approveConnectionAndCheckSuccess()
    const connections = await navPanel.goToListConnections()
    const numConnections = await connections.getNumberOfConnections()
    expect(
      numConnections,
      `expected a connection to be present after approving, found ${numConnections} connection(s)`
    ).toBe(1)
    // remove the connection, assert none left
  })
})
