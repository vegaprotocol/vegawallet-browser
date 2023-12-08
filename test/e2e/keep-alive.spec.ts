import { WebDriver } from 'selenium-webdriver'
import { captureScreenshot, initDriver } from './helpers/driver'
import { ViewWallet } from './page-objects/view-wallet'
import { APIHelper } from './helpers/wallet/wallet-api'
import { VegaAPI } from './helpers/wallet/vega-api'
import { ConnectWallet } from './page-objects/connect-wallet'
import { Telemetry } from './page-objects/telemetry-opt-in'
import { navigateToExtensionLandingPage, setUpWalletAndKey } from './helpers/wallet/wallet-setup'
import { staticWait, switchWindowHandles } from './helpers/selenium-util'

describe('Keep alive', () => {
  let driver: WebDriver
  let viewWallet: ViewWallet
  let vegaAPI: VegaAPI
  let connectWallet: ConnectWallet
  let apiHelper: APIHelper
  let telemetry: Telemetry

  beforeEach(async () => {
    driver = await initDriver()
    viewWallet = new ViewWallet(driver)
    vegaAPI = new VegaAPI(driver)
    connectWallet = new ConnectWallet(driver)
    telemetry = new Telemetry(driver)
    apiHelper = new APIHelper(driver)
    await navigateToExtensionLandingPage(driver)
    await setUpWalletAndKey(driver)
  })

  afterEach(async () => {
    await captureScreenshot(driver, expect.getState().currentTestName as string)
    await driver.quit()
  })

  it('app does not sleep after five minutes of inactivity', async () => {
    await viewWallet.checkOnViewWalletPage()
    const vegaWalletHandle = await driver.getWindowHandle()
    await vegaAPI.openNewWindow()
    await staticWait(300000)
    await switchWindowHandles(driver, false, vegaWalletHandle)
    await viewWallet.checkOnViewWalletPage()
  })
})
