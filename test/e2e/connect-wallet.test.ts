import { WebDriver } from 'selenium-webdriver'
import { captureScreenshot, initDriver } from './driver'
import { ViewWallet } from './page-objects/view-wallet'
import { navigateToLandingPage } from './wallet-helpers/common'
import { APIHelper } from './wallet-helpers/api-helpers'
import { VegaAPI } from './wallet-helpers/vega-api'
import { ConnectWallet } from './page-objects/connect-wallet'
import { NavPanel } from './page-objects/navpanel'
import { GetStarted } from './page-objects/get-started'
import { SecureYourWallet } from './page-objects/secure-your-wallet'

describe.skip('Connect wallet', () => {
  let driver: WebDriver
  let viewWallet: ViewWallet
  let vegaAPI: VegaAPI
  let connectWallet: ConnectWallet
  let apiHelper: APIHelper
  const testPassword = 'password1'

  beforeEach(async () => {
    driver = await initDriver()
    viewWallet = new ViewWallet(driver)
    vegaAPI = new VegaAPI(driver)
    connectWallet = new ConnectWallet(driver)
    apiHelper = new APIHelper(driver)
    await navigateToLandingPage(driver)
  })

  afterEach(async () => {
    await captureScreenshot(driver, expect.getState().currentTestName as string)
    await driver.quit()
  })

  it('can approve a connection to the wallet and return to previously active view', async () => {
    // 1101-BWAL-040 There is a visual way to understand that a connection has been successful
    // 1101-BWAL-042 If the had the browser wallet open when I instigated the connection request, the browser wallet returns your view to where you were before the request came in
    await apiHelper.setUpWalletAndKey()
    const navPanel = new NavPanel(driver)
    const settings = await navPanel.goToSettings()
    await vegaAPI.connectWalletAndCheckSuccess()
    await connectWallet.checkOnConnectWallet()
    await connectWallet.approveConnectionAndCheckSuccess()
    await settings.checkOnSettingsPage()
  })

  it('can reject a connection to the wallet and return to previously active view', async () => {
    await apiHelper.setUpWalletAndKey()
    const navPanel = new NavPanel(driver)
    const settings = await navPanel.goToSettings()
    await vegaAPI.connectWalletAndCheckSuccess()
    await connectWallet.checkOnConnectWallet()
    await connectWallet.denyConnection()
    await settings.checkOnSettingsPage()
  })

  it('queues a connection request for when I have finished onboarding', async () => {
    // 1101-BWAL-043 When I try to connect to the wallet I've made during onboarding but have not "completed" onboarding, I cannot see the connection request until I've completed onboarding (it is queued in the background)
    await vegaAPI.connectWallet()
    const getStarted = new GetStarted(driver)
    const passwordPage = await getStarted.getStarted()
    await passwordPage.createPassword(testPassword)
    const secureYouWallet = new SecureYourWallet(driver)
    await secureYouWallet.revealRecoveryPhrase(true)
    await connectWallet.checkOnConnectWallet()
    await connectWallet.approveConnectionAndCheckSuccess()
  })

  it('does not need to reconnect to the wallet if I navigate away from my current page', async () => {
    // 1101-BWAL-039 When I go away from the extension and come back to the connected site, the browser extension remembers the connection and does not ask me to reconnect
    await apiHelper.setUpWalletAndKey()
    await vegaAPI.connectWallet()
    await connectWallet.approveConnectionAndCheckSuccess()
    await driver.get('https://google.co.uk')
    await navigateToLandingPage(driver)
    const connections = await apiHelper.listConnections()
  })
})
