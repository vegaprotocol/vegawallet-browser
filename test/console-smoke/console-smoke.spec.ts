import { WebDriver } from 'selenium-webdriver'
import { ConnectWallet } from '../e2e/page-objects/connect-wallet'
import { APIHelper } from '../e2e/helpers/wallet/wallet-api'
import { captureScreenshot, initDriver } from '../e2e/helpers/driver'
import { navigateToExtensionLandingPage } from '../e2e/helpers/wallet/wallet-setup'
import { Transaction } from '../e2e/page-objects/transaction'
import { switchWindowHandles, windowHandleHasCount } from '../e2e/helpers/selenium-util'
import { consoleSmokeRecoveryPhrase } from '../e2e/helpers/wallet/common-wallet-values'
import smokeConsole from '../../config/console-smoke'
import { Console } from './console'

let driver: WebDriver
let connectWallet: ConnectWallet
let apiHelper: APIHelper
let transaction: Transaction
let vegaConsole: Console

beforeEach(async () => {
  driver = await initDriver()
  driver.manage().window().maximize()
  connectWallet = new ConnectWallet(driver)
  apiHelper = new APIHelper(driver)
  transaction = new Transaction(driver)
  vegaConsole = new Console(driver)
  await navigateToExtensionLandingPage(driver)
  await apiHelper.setUpWalletAndKey('password', 'wallet', 'Key 1', false, consoleSmokeRecoveryPhrase)
  await navigateToExtensionLandingPage(driver)
})

afterEach(async () => {
  await captureScreenshot(driver, expect.getState().currentTestName as string)
  await driver.quit()
})

it('check console and browser wallet integrate', async () => {
  driver.get(smokeConsole.network.console)
  const handles = await driver.getAllWindowHandles()
  expect(handles.length).toBe(1)
  const consoleHandle = handles[0]

  await vegaConsole.clearWelcomeDialogIfShown()
  await vegaConsole.checkOnConsole()
  await vegaConsole.selectTBTCMarket()
  await vegaConsole.connectToWallet()
  expect(await windowHandleHasCount(driver, 2)).toBe(true)
  let walletHandle = (await driver.getAllWindowHandles())[1]

  await switchWindowHandles(driver, false, walletHandle)
  await connectWallet.checkOnConnectWallet()
  await connectWallet.approveConnectionAndCheckSuccess()

  await switchWindowHandles(driver, false, consoleHandle)
  expect(await windowHandleHasCount(driver, 1)).toBe(true)
  await vegaConsole.waitForConnectDialogToDissapear()
  await vegaConsole.goToOrderTab()
  await vegaConsole.submitOrder('0.001', '0.001')
  expect(await windowHandleHasCount(driver, 2)).toBe(true)

  const transactionWalletHandle = (await driver.getAllWindowHandles())[1]
  await switchWindowHandles(driver, false, transactionWalletHandle)
  transaction = new Transaction(driver)
  await transaction.confirmTransaction()

  await switchWindowHandles(driver, false, consoleHandle)
  expect(await windowHandleHasCount(driver, 1)).toBe(true)
  await vegaConsole.checkTransactionSuccess()
})
