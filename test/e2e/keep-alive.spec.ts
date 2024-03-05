import { WebDriver } from 'selenium-webdriver'
import { captureScreenshot, initDriver } from './helpers/driver'
import { ViewWallet } from './page-objects/view-wallet'
import { APIHelper } from './helpers/wallet/wallet-api'
import { VegaAPI } from './helpers/wallet/vega-api'
import { ConnectWallet } from './page-objects/connect-wallet'
import { navigateToExtensionLandingPage, setUpWalletAndKey } from './helpers/wallet/wallet-setup'
import { staticWait, switchWindowHandles } from './helpers/selenium-util'

describe('Keep alive', () => {
  let driver: WebDriver
  let viewWallet: ViewWallet
  let vegaAPI: VegaAPI
  let connectWallet: ConnectWallet
  let apiHelper: APIHelper

  beforeEach(async () => {
    driver = await initDriver()
    viewWallet = new ViewWallet(driver)
    vegaAPI = new VegaAPI(driver)
    connectWallet = new ConnectWallet(driver)
    apiHelper = new APIHelper(driver)
    await navigateToExtensionLandingPage(driver)
    await setUpWalletAndKey(driver)
  })

  afterEach(async () => {
    await captureScreenshot(driver, expect.getState().currentTestName as string)
    await driver.quit()
  })

  it('app does not sleep after five minutes of inactivity', async () => {
    // 1133-KPAL-001 If I do not interact with browser wallet for five minutes I remain logged in to the wallet
    await viewWallet.checkOnViewWalletPage()
    const vegaWalletHandle = await driver.getWindowHandle()
    await vegaAPI.openNewWindow()
    await vegaAPI.addEventListener('client.disconnected')
    //sleep for five minutes. This is to give the app chance to (incorrectly) go to sleep
    await staticWait(300000)
    const { events, callCounter } = await vegaAPI.getEventResult('client.disconnected')
    expect(events).toEqual([])
    expect(callCounter).toEqual(0)
    await vegaAPI.removeEventListener('client.disconnected')
    await switchWindowHandles(driver, false, vegaWalletHandle)
    await viewWallet.checkOnViewWalletPage()
  })
})
