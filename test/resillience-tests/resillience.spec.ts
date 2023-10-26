import { WebDriver } from 'selenium-webdriver'
import { captureScreenshot } from '../e2e/helpers/driver'
import { ViewWallet } from '../e2e/page-objects/view-wallet'
import { createWalletAndDriver, navigateToExtensionLandingPage } from '../e2e/helpers/wallet/wallet-setup'
import { closeServerAndWait, createServer } from '../e2e/helpers/wallet/http-server'
import { KeyDetails } from '../e2e/page-objects/key-details'
import { Server } from 'http'
import test from '../../config/test'

describe('Check browser wallet is resillient to node outages', () => {
  let driver: WebDriver
  let viewWallet: ViewWallet
  let keyDetails: KeyDetails
  let server: Server
  let closeServer: boolean

  beforeEach(async () => {
    driver = await createWalletAndDriver()
    viewWallet = new ViewWallet(driver)
    keyDetails = new KeyDetails(driver)
    closeServer = true
  })

  afterEach(async () => {
    if (closeServer) {
      await closeServerAndWait(server)
    }
    await captureScreenshot(driver, expect.getState().currentTestName as string)
    await driver.quit()
  })

  it('shows an error when no nodes are available', async () => {
    closeServer = false
    await navigateToExtensionLandingPage(driver)
    await viewWallet.openKeyDetails('Key 1')
    const errorText = await keyDetails.getNotificationText()
    expect(errorText).toBe('An error occurred when loading account information: Failed to fetch data')
  })

  it('shows an error if a node outage occurrs after initially having a connection', async () => {
    server = createServer()
    server.listen(test.test.mockPort)
    await navigateToExtensionLandingPage(driver)
    await viewWallet.openKeyDetails('Key 1')
    expect(await keyDetails.isNotificationDisplayed(500)).toBe(false)
    await closeServerAndWait(server)
    await navigateToExtensionLandingPage(driver)
    expect(await keyDetails.isNotificationDisplayed()).toBe(true)
    const errorText = await keyDetails.getNotificationText()
    expect(errorText).toBe('An error occurred when loading account information: Failed to fetch data')
    closeServer = false
  })
  it('does not show an error when the market endpoint is down', async () => {
    server = createServer({ includeMarkets: false })
    server.listen(test.test.mockPort)
    await navigateToExtensionLandingPage(driver)
    await viewWallet.openKeyDetails('Key 1')
    expect(await keyDetails.isNotificationDisplayed(500)).toBe(false)
  })
  it('shows an error when assets endpoint only is down', async () => {
    server = createServer({ includeAssets: false })
    server.listen(test.test.mockPort)
    await navigateToExtensionLandingPage(driver)
    await viewWallet.openKeyDetails('Key 1')
    const errorText = await keyDetails.getNotificationText()
    expect(errorText).toBe('An error occurred when loading account information: Failed to fetch data')
  })
  it('shows an error when accounts endpoint only is down', async () => {
    server = createServer({ includeAccounts: false })
    server.listen(test.test.mockPort)
    await navigateToExtensionLandingPage(driver)
    await viewWallet.openKeyDetails('Key 1')
    const errorText = await keyDetails.getNotificationText()
    expect(errorText).toBe('An error occurred when loading account information: Failed to fetch data')
  })
})
