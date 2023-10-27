import { WebDriver } from 'selenium-webdriver'
import { captureScreenshot } from '../e2e/helpers/driver'
import { ViewWallet } from '../e2e/page-objects/view-wallet'
import { createWalletAndDriver, navigateToExtensionLandingPage } from '../e2e/helpers/wallet/wallet-setup'
import { ServerConfig, closeServerAndWait, createServer } from '../e2e/helpers/wallet/http-server'
import { KeyDetails } from '../e2e/page-objects/key-details'
import { Server } from 'http'
import test from '../../config/test'
import { VegaAPI } from '../e2e/helpers/wallet/vega-api'
import { ConnectWallet } from '../e2e/page-objects/connect-wallet'
import { Transaction } from '../e2e/page-objects/transaction'
import { dummyTransaction } from '../e2e/helpers/wallet/common-wallet-values'

describe('Check browser wallet is resillient to node outages', () => {
  let driver: WebDriver
  let viewWallet: ViewWallet
  let keyDetails: KeyDetails
  let server: Server
  let closeServer: boolean
  let vegaAPI: VegaAPI
  let connectWallet: ConnectWallet
  let transaction: Transaction

  beforeEach(async () => {
    driver = await createWalletAndDriver()
    viewWallet = new ViewWallet(driver)
    keyDetails = new KeyDetails(driver)
    vegaAPI = new VegaAPI(driver)
    connectWallet = new ConnectWallet(driver)
    transaction = new Transaction(driver)
    closeServer = true
  })

  afterEach(async () => {
    if (closeServer) {
      await closeServerAndWait(server)
    }
    await captureScreenshot(driver, expect.getState().currentTestName as string)
    await driver.quit()
  })

  describe('transaction views are resilient to node outages', () => {
    beforeEach(async () => {
      await navigateToExtensionLandingPage(driver)
    })

    const testCases = [
      { name: 'no nodes available', options: {} },
      { name: 'market endpoint is down', options: { includeMarkets: false }, expectError: true },
      { name: 'assets endpoint is down', options: { includeAssets: false }, expectError: true },
      { name: 'accounts endpoint is down', options: { includeAccounts: false }, expectError: true },
      { name: 'blockchain height endpoint is down', options: { includeBlockchainHeight: false }, expectError: true },
      { name: 'raw transaction endpoint is down', options: { includeRawTransaction: false }, expectError: true },
      { name: 'all endpoints available', options: {}, expectError: false }
    ]

    testCases.forEach((testCase) => {
      it(`shows the appropriate view when ${testCase.name}`, async () => {
        server = await startServer(testCase.options)
        await connectWalletAndSendTransaction()
        expect(await transaction.isErrorLoadingDataDisplayed()).toBe(testCase.expectError)
      })
    })
  })

  describe('key details are resillient to node outages', () => {
    it('shows an error when no nodes are available', async () => {
      closeServer = false
      await navigateToExtensionLandingPage(driver)
      await viewWallet.openKeyDetails('Key 1')
      const errorText = await keyDetails.getNotificationText()
      expect(errorText).toBe('An error occurred when loading account information: Failed to fetch data')
    })

    it('shows an error if a node outage occurrs after initially having a connection', async () => {
      server = await startServer()
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
      server = await startServer({ includeMarkets: false })
      await navigateToExtensionLandingPage(driver)
      await viewWallet.openKeyDetails('Key 1')
      expect(await keyDetails.isNotificationDisplayed(500)).toBe(false)
    })
    it('shows an error when assets endpoint only is down', async () => {
      server = await startServer({ includeAssets: false })
      await navigateToExtensionLandingPage(driver)
      await viewWallet.openKeyDetails('Key 1')
      const errorText = await keyDetails.getNotificationText()
      expect(errorText).toBe('An error occurred when loading account information: Failed to fetch data')
    })
    it('shows an error when accounts endpoint only is down', async () => {
      server = await startServer({ includeAccounts: false })
      await navigateToExtensionLandingPage(driver)
      await viewWallet.openKeyDetails('Key 1')
      const errorText = await keyDetails.getNotificationText()
      expect(errorText).toBe('An error occurred when loading account information: Failed to fetch data')
    })
  })

  async function startServer(config: ServerConfig = {}) {
    const sv = createServer(config)
    sv.listen(test.test.mockPort)
    return sv
  }

  async function connectWalletAndSendTransaction() {
    await vegaAPI.connectWalletAndCheckSuccess()
    await connectWallet.checkOnConnectWallet()
    await connectWallet.approveConnectionAndCheckSuccess()
    const keys = await vegaAPI.listKeys()
    await vegaAPI.sendTransaction(keys[0].publicKey, { transfer: dummyTransaction })
  }
})
