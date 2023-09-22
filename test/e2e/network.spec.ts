import { WebDriver } from 'selenium-webdriver'
import { captureScreenshot } from './helpers/driver'
import test from '../../config/test'
import { ExtensionHeader } from './page-objects/extension-header'
import { createWalletAndDriver } from './helpers/wallet/wallet-setup'
import { closeServerAndWait, server } from './helpers/wallet/http-server'

describe('Network tests', () => {
  let driver: WebDriver
  let extensionHeader: ExtensionHeader

  beforeEach(async () => {
    driver = await createWalletAndDriver()
    extensionHeader = new ExtensionHeader(driver)
  })

  afterEach(async () => {
    await captureScreenshot(driver, expect.getState().currentTestName as string)
    await driver.quit()
  })

  beforeAll(async () => {
    server.listen(test.test.mockPort)
  })

  afterAll(async () => {
    await closeServerAndWait()
  })

  it('defaults to the fairground network', async () => {
    // 1108-NTWK-001 The browser wallet defaults to use the network declared in config
    // 1108-NTWK-002 I can see which vega network the browser wallet is connected to from the view wallet page
    const connectedNetwork = await extensionHeader.getNetworkConnectedTo()
    expect(connectedNetwork.toLowerCase()).toBe(test.network.name.toLowerCase())
  })
})
