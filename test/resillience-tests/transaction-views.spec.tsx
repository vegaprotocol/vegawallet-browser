import { WebDriver } from 'selenium-webdriver'
import { captureScreenshot } from '../e2e/helpers/driver'
import { createWalletAndDriver, navigateToExtensionLandingPage } from '../e2e/helpers/wallet/wallet-setup'
import { closeServerAndWait } from '../e2e/helpers/wallet/http-server'
import { Server } from 'http'
import { VegaAPI } from '../e2e/helpers/wallet/vega-api'
import { ConnectWallet } from '../e2e/page-objects/connect-wallet'
import { Transaction } from '../e2e/page-objects/transaction'
import { dummyTransaction } from '../e2e/helpers/wallet/common-wallet-values'
import { startServer } from './helpers'

describe('Transaction views are resilient to node outages', () => {
  let driver: WebDriver
  let server: Server
  let closeServer: boolean
  let vegaAPI: VegaAPI
  let connectWallet: ConnectWallet
  let transaction: Transaction

  async function connectWalletAndSendTransaction() {
    await vegaAPI.connectWalletAndCheckSuccess()
    await connectWallet.checkOnConnectWallet()
    await connectWallet.approveConnectionAndCheckSuccess()
    const keys = await vegaAPI.listKeys()
    await vegaAPI.sendTransaction(keys[0].publicKey, { transfer: dummyTransaction })
  }

  beforeEach(async () => {
    driver = await createWalletAndDriver()
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

  const testCases = [
    { name: 'no nodes available', options: {}, startServer: false, expectError: true },
    { name: 'market endpoint is down', options: { includeMarkets: false }, startServer: true, expectError: true },
    { name: 'assets endpoint is down', options: { includeAssets: false }, startServer: true, expectError: true },
    { name: 'accounts endpoint is down', options: { includeAccounts: false }, startServer: true, expectError: false },
    {
      name: 'blockchain height endpoint is down',
      options: { includeBlockchainHeight: false },
      startServer: true,
      expectError: true
    },
    { name: 'all endpoints available', options: {}, startServer: true, expectError: false }
  ]

  testCases.forEach((testCase) => {
    it(`shows the appropriate view when ${testCase.name}`, async () => {
      if (testCase.startServer) {
        server = await startServer(testCase.options)
      }
      await navigateToExtensionLandingPage(driver)

      await connectWalletAndSendTransaction()
      expect(await transaction.isErrorLoadingDataDisplayed()).toBe(testCase.expectError)
      closeServer = testCase.startServer
    })
  })
})
