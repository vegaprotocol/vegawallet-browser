import { WebDriver } from 'selenium-webdriver'
import { captureScreenshot, initDriver } from './driver'
import { ViewWallet } from './page-objects/view-wallet'
import { navigateToLandingPage } from './wallet-helpers/common'
import { APIHelper } from './wallet-helpers/api-helpers'
import test from '../../config/test'

describe('Network tests', () => {
  let driver: WebDriver
  let viewWallet: ViewWallet

  beforeEach(async () => {
    driver = await initDriver()
    viewWallet = new ViewWallet(driver)
    await navigateToLandingPage(driver)
    const apiHelper = new APIHelper(driver)
    await apiHelper.setUpWalletAndKey()
    await navigateToLandingPage(driver)
  })

  afterEach(async () => {
    await captureScreenshot(driver, expect.getState().currentTestName as string)
    await driver.quit()
  })

  it('defaults to the fairground network', async () => {
    // 1101-BWAL-029 The browser wallet defaults to use the Fairground network
    // 1101-BWAL-030 I can see which vega network the browser wallet is connected to from the view wallet page
    const connectedNetwork = await viewWallet.getNetworkConnectedTo()
    expect(connectedNetwork.toLowerCase()).toBe(test.network.name.toLowerCase())
  })
})
