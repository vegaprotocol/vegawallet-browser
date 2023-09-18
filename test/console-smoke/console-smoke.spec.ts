import { WebDriver } from 'selenium-webdriver'
import { ConnectWallet } from '../e2e/page-objects/connect-wallet'
import { APIHelper } from '../e2e/helpers/wallet/wallet-api'
import { captureScreenshot, initDriver } from '../e2e/helpers/driver'
import { navigateToExtensionLandingPage } from '../e2e/helpers/wallet/wallet-setup'
import { Transaction } from '../e2e/page-objects/transaction'
import { switchWindowHandles, windowHandleHasCount } from '../e2e/helpers/selenium-util'
import {
  consoleSmokeMainnetRecoveryPhrase,
  consoleSmokeRecoveryPhrase
} from '../e2e/helpers/wallet/common-wallet-values'
import { Console } from './console'
import smokeConsoleMainnet from '../../config/console-smoke-mainnet'
import smokeConsoleTestnet from '../../config/console-smoke-testnet'

let driver: WebDriver
let connectWallet: ConnectWallet
let apiHelper: APIHelper
let transaction: Transaction
let vegaConsole: Console
let recoveryPhrase: string
let approveTransaction: boolean
let market: string
let config: any
let acceptRisk: boolean

beforeEach(async () => {
  driver = await initDriver()
  driver.manage().window().maximize()
  connectWallet = new ConnectWallet(driver)
  apiHelper = new APIHelper(driver)
  transaction = new Transaction(driver)
  vegaConsole = new Console(driver)
  await navigateToExtensionLandingPage(driver)
  if (process.env.ENV === 'mainnet') {
    recoveryPhrase = consoleSmokeMainnetRecoveryPhrase
    approveTransaction = false
    market = 'USDT'
    config = smokeConsoleMainnet
    acceptRisk = true
  } else {
    recoveryPhrase = consoleSmokeRecoveryPhrase
    approveTransaction = true
    market = 'tBTC'
    config = smokeConsoleTestnet
    acceptRisk = false
  }
  await apiHelper.setUpWalletAndKey('password', 'wallet', 'Key 1', false, recoveryPhrase)
  await navigateToExtensionLandingPage(driver)
})

afterEach(async () => {
  await captureScreenshot(driver, expect.getState().currentTestName as string)
  await driver.quit()
})

it('check console and browser wallet integrate', async () => {
  driver.get(config.network.console)
  const handles = await driver.getAllWindowHandles()
  expect(handles.length).toBe(1)
  const consoleHandle = handles[0]

  await vegaConsole.clearWelcomeDialogIfShown()
  await vegaConsole.checkOnConsole()
  await vegaConsole.selectMarketBySubstring(market)
  await vegaConsole.connectToWallet()
  expect(await windowHandleHasCount(driver, 2)).toBe(true)
  let walletHandle = (await driver.getAllWindowHandles())[1]

  await switchWindowHandles(driver, false, walletHandle)
  await connectWallet.checkOnConnectWallet()
  await connectWallet.approveConnectionAndCheckSuccess()

  await switchWindowHandles(driver, false, consoleHandle)
  expect(await windowHandleHasCount(driver, 1)).toBe(true)
  if (acceptRisk) {
    await vegaConsole.agreeToUnderstandRisk()
  }
  await vegaConsole.waitForConnectDialogToDissapear()
  await vegaConsole.goToOrderTab()
  await vegaConsole.submitOrder('0.001', '0.01')
  expect(await windowHandleHasCount(driver, 2)).toBe(true)

  const transactionWalletHandle = (await driver.getAllWindowHandles())[1]
  await switchWindowHandles(driver, false, transactionWalletHandle)
  if (approveTransaction) {
    await transaction.confirmTransaction()
    await switchWindowHandles(driver, false, consoleHandle)
    await vegaConsole.checkTransactionSuccess()
  } else {
    await transaction.rejectTransaction()
    await switchWindowHandles(driver, false, consoleHandle)
  }
  expect(await windowHandleHasCount(driver, 1)).toBe(true)
})
