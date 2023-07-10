import { WebDriver } from 'selenium-webdriver'
import { captureScreenshot, initDriver } from './driver'
import { navigateToLandingPage } from './wallet-helpers/common'
import { APIHelper } from './wallet-helpers/api-helpers'
import test from '../../config/test'
import { ExtensionHeader } from './page-objects/extension-header'

describe('Network tests', () => {
  let driver: WebDriver
  let extensionHeader: ExtensionHeader

  beforeEach(async () => {
    driver = await initDriver()
    extensionHeader = new ExtensionHeader(driver)
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
    // 1108-NTWK-001 The browser wallet defaults to use the network declared in config
    // 1108-NTWK-002 I can see which vega network the browser wallet is connected to from the view wallet page
    const connectedNetwork = await extensionHeader.getNetworkConnectedTo()
    expect(connectedNetwork.toLowerCase()).toBe(test.network.name.toLowerCase())
  })
})
