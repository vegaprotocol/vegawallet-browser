import { WebDriver } from 'selenium-webdriver'
import { ConnectWallet } from '../e2e/page-objects/connect-wallet'
import { APIHelper } from '../e2e/helpers/wallet/wallet-api'
import { captureScreenshot, initDriver } from '../e2e/helpers/driver'
import { navigateToExtensionLandingPage } from '../e2e/helpers/wallet/wallet-setup'
import { Transaction } from '../e2e/page-objects/transaction'
import { goToNewWindowHandle, switchWindowHandles, windowHandleHasCount } from '../e2e/helpers/selenium-util'
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
  const handlesBeforeConnect = await driver.getAllWindowHandles()
  const consoleHandle = await driver.getWindowHandle()

  await vegaConsole.clearWelcomeDialogIfShown()
  await vegaConsole.checkOnConsole()
  await vegaConsole.selectMarketBySubstring(market)
  await vegaConsole.connectToWallet()
  expect(await windowHandleHasCount(driver, handlesBeforeConnect.length + 1)).toBe(true)
  const handlesAfterConnect = await driver.getAllWindowHandles()

  await goToNewWindowHandle(driver, handlesBeforeConnect, handlesAfterConnect)
  await connectWallet.checkOnConnectWallet()
  await connectWallet.approveConnectionAndCheckSuccess()

  console.log('switching window handle')
  await switchWindowHandles(driver, false, consoleHandle)
  console.log('switched window handle')
  expect(await windowHandleHasCount(driver, handlesBeforeConnect.length)).toBe(true)
  console.log('window handle has expected count')
  if (acceptRisk) {
    await vegaConsole.agreeToUnderstandRisk()
  }
  await vegaConsole.waitForConnectDialogToDissapear()
  console.log('connect dialog dissapeared')
  const handlesBeforeOrder = await driver.getAllWindowHandles()
  await vegaConsole.goToOrderTab()
  console.log('went to order tab')
  await vegaConsole.submitOrder('0.001', '0.01')
  console.log('about to check window handle count')
  expect(await windowHandleHasCount(driver, handlesBeforeConnect.length + 1)).toBe(true)
  console.log('had expected count')
  const handlesAfterOrder = await driver.getAllWindowHandles()

  console.log('going to new window handle')
  await goToNewWindowHandle(driver, handlesBeforeOrder, handlesAfterOrder)
  if (approveTransaction) {
    console.log('about to confirm transaction')
    await transaction.confirmTransaction()
    console.log('confirmed')
    await switchWindowHandles(driver, false)
    console.log('switched back tabs')
    await vegaConsole.checkTransactionSuccess()
    console.log('success!')
  } else {
    console.log('about to reject transaction')
    await transaction.rejectTransaction()
    console.log('rejected')
    await switchWindowHandles(driver, false)
    console.log('switched back tabs')
  }
})

//test test
