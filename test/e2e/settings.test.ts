import { WebDriver } from 'selenium-webdriver'
import { captureScreenshot, initDriver } from './driver'
import { navigateToLandingPage } from './wallet-helpers/common'
import { NavPanel } from './page-objects/navpanel'
import { APIHelper } from './wallet-helpers/api-helpers'
import { staticWait, switchWindowHandles } from './selenium-util'
import { VegaAPI } from './wallet-helpers/vega-api'
import { Transaction } from './page-objects/transaction'
import { ConnectWallet } from './page-objects/connect-wallet'
import { connect } from 'http2'
import { ViewWallet } from './page-objects/view-wallet'

describe('Settings test', () => {
  let driver: WebDriver

  beforeEach(async () => {
    driver = await initDriver()
    await navigateToLandingPage(driver)
    const apiHelper = new APIHelper(driver)
    await apiHelper.setUpWalletAndKey()
    await navigateToLandingPage(driver)
  })

  afterEach(async () => {
    await captureScreenshot(driver, expect.getState().currentTestName as string)
    await driver.quit()
  })

  it('can navigate to settings and lock the wallet, wallent version is visible', async () => {
    // 1101-BWAL-068 I can see a lock button and when I press it I am logged out and redirect to the login page
    const navPanel = new NavPanel(driver)
    const settingsPage = await navPanel.goToSettings()
    await settingsPage.lockWalletAndCheckLoginPageAppears()
  })

  it('can open the wallet extension in a pop out window', async () => {
    // 1101-BWAL-092 There is a way for me to open the browser wallet in a new window
    // 1101-BWAL-087 If I have a new window open, if there is a transaction for me to approve or reject this is shown in the new window
    // 1101-BWAL-088 If I approve the transaction the new window stays open (on the last view I was on)
    // 1101-BWAL-089 If I reject the transaction the pop-up window stays open (on the last view I was on)
    // 1101-BWAL-091 If I have the new window open but then open the extension pop up I see the same thing on both views (<a name="1101-BWAL-091" href="#1101-BWAL-091">1101-BWAL-091</a>)
    const windowHandles = await driver.getAllWindowHandles()
    const vegaAPI = new VegaAPI(driver, windowHandles[0])
    await vegaAPI.connectWallet()
    const connectWalletModal = new ConnectWallet(driver)
    await connectWalletModal.approveConnectionAndCheckSuccess()
    const viewWallet = new ViewWallet(driver)
    await viewWallet.checkOnViewWalletPage()
    const navPanel = new NavPanel(driver)
    await staticWait(5000)
    const settingsPage = await navPanel.goToSettings()
    const popoutWindowHandle = await settingsPage.openAppInNewWindowAndSwitchToIt()
    expect(await settingsPage.isSettingsPage()).toBe(true)
    await vegaAPI.connectWallet(false)
    await driver.switchTo().window(popoutWindowHandle)
  })
})
