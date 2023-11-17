import { WebDriver } from 'selenium-webdriver'
import { ConnectWallet } from '../e2e/page-objects/connect-wallet'
import { APIHelper } from '../e2e/helpers/wallet/wallet-api'
import {
  captureScreenshot,
  initDriver,
  isDriverInstanceClosed,
  runTestRetryIfDriverCrashes
} from '../e2e/helpers/driver'
import { navigateToExtensionLandingPage } from '../e2e/helpers/wallet/wallet-setup'
import { Transaction } from '../e2e/page-objects/transaction'
import { goToNewWindowHandle, switchWindowHandles, windowHandleHasCount } from '../e2e/helpers/selenium-util'
import { Console } from './console'
import smokeConsoleMainnet from '../../config/console-smoke-mainnet'
import smokeConsoleTestnet from '../../config/console-smoke-testnet'
import dotenv from 'dotenv'
import path from 'path'

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

beforeAll(async () => {
  const envPath = path.join(__dirname, '../../', '.env.local')
  if (process.env.GITHUB_ACTIONS !== 'true') {
    dotenv.config({ path: envPath })
  }
  console.log('emv: ', process.env.ENV)
  if (process.env.ENV === 'testnet' && process.env.TESTNET_RECOVERY_PHRASE === undefined) {
    throw new Error(
      'Please set TESTNET_RECOVERY_PHRASE .env.local if running locally, otherwise check secrets are configured correctly for CI'
    )
  } else if (process.env.ENV === 'mainnet' && process.env.MAINNET_RECOVERY_PHRASE === undefined) {
    throw new Error(
      'Please set MAINNET_RECOVERY_PHRASE .env.local if running locally, otherwise check secrets are configured correctly for CI'
    )
  }
})

beforeEach(async () => {
  await setUpTests()
})

afterEach(async () => {
  await tearDownTests()
})

it('check console and browser wallet integrate', async () => {
  await runTestRetryIfDriverCrashes(async () => {
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
    expect(await isDriverInstanceClosed(driver, consoleHandle)).toBe(true)

    expect(await windowHandleHasCount(driver, handlesBeforeConnect.length)).toBe(true)
    if (acceptRisk) {
      await vegaConsole.agreeToUnderstandRisk()
    }
    await vegaConsole.waitForConnectDialogToDissapear()
    const handlesBeforeOrder = await driver.getAllWindowHandles()
    await vegaConsole.goToOrderTab()
    await vegaConsole.submitOrder('0.001', '0.1')
    expect(await windowHandleHasCount(driver, handlesBeforeConnect.length + 1)).toBe(true)
    const handlesAfterOrder = await driver.getAllWindowHandles()
    await goToNewWindowHandle(driver, handlesBeforeOrder, handlesAfterOrder)
    if (approveTransaction) {
      await transaction.confirmTransaction()
      await switchWindowHandles(driver, false)
      await vegaConsole.checkTransactionSuccess()
    } else {
      await transaction.rejectTransaction()
      await switchWindowHandles(driver, false)
    }
  })
})

async function setUpTests() {
  driver = await initDriver()
  driver.manage().window().maximize()
  connectWallet = new ConnectWallet(driver)
  apiHelper = new APIHelper(driver)
  transaction = new Transaction(driver)
  vegaConsole = new Console(driver)
  await navigateToExtensionLandingPage(driver)
  if (process.env.ENV === 'mainnet') {
    recoveryPhrase = process.env.MAINNET_RECOVERY_PHRASE ?? ''
    approveTransaction = false
    market = 'USDT'
    config = smokeConsoleMainnet
    acceptRisk = true
  } else {
    recoveryPhrase = process.env.TESTNET_RECOVERY_PHRASE ?? ''
    approveTransaction = true
    market = 'USDT'
    config = smokeConsoleTestnet
    acceptRisk = false
  }
  await apiHelper.setUpWalletAndKey('password', 'wallet', 'Key 1', false, recoveryPhrase)
  await navigateToExtensionLandingPage(driver)
}

async function tearDownTests() {
  await captureScreenshot(driver, expect.getState().currentTestName as string)
  await driver.quit()
}
