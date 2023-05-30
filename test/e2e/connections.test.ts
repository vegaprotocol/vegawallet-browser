import { WebDriver } from 'selenium-webdriver'
import { captureScreenshot, initDriver } from './driver'
import { ViewWallet } from './page-objects/view-wallet'
import { navigateToLandingPage } from './wallet-helpers/common'
import { APIHelper } from './wallet-helpers/api-helpers'
import { VegaAPI } from './wallet-helpers/vega-api'

describe('Connect to wallet', () => {
  let driver: WebDriver
  let viewWallet: ViewWallet
  let vega: VegaAPI
  const testPassword = 'password1'

  beforeEach(async () => {
    driver = await initDriver()
    vega = new VegaAPI(driver)
    viewWallet = new ViewWallet(driver)
    await navigateToLandingPage(driver)
    const apiHelper = new APIHelper(driver)
    await apiHelper.setUpWalletAndKey(testPassword, 'Wallet 1', 'Key 1')
    await navigateToLandingPage(driver)
  })

  afterEach(async () => {
    await captureScreenshot(driver, expect.getState().currentTestName as string)
    await driver.quit()
  })

  it('can accept a request to connect', async () => {
    await vega.connectWallet()
  })

  it('queues a request to connect if I have not yet onboarded', async () => {
    await vega.connectWallet()
  })
})
