import { WebDriver } from 'selenium-webdriver'
import { VegaAPI } from './helpers/wallet/vega-api'
import { ConnectWallet } from './page-objects/connect-wallet'
import { APIHelper } from './helpers/wallet/wallet-api'
import { captureScreenshot, initDriver, isDriverInstanceClosed, runTestRetryIfDriverCrashes } from './helpers/driver'
import { dummyTransaction } from './helpers/wallet/common-wallet-values'
import { goToNewWindowHandle, switchWindowHandles, windowHandleHasCount } from './helpers/selenium-util'
import { Transaction } from './page-objects/transaction'
import { navigateToExtensionLandingPage, setUpWalletAndKey } from './helpers/wallet/wallet-setup'

describe('check popout functionality', () => {
  let dappHandle = ''
  let driver: WebDriver
  let vegaAPI: VegaAPI
  let connectWallet: ConnectWallet
  let apiHelper: APIHelper
  let transaction: Transaction
  let originalHandle: string

  beforeEach(async () => {
    await setupTests()
  })

  afterEach(async () => {
    await tearDownTests()
  })

  it('connect request opens in popout and can be approved when extension not already open', async () => {
    // 1113-POPT-001 The browser wallet opens in a pop-up window when there is a connection request
    // 1113-POPT-003 If I approve the connection the pop-up window closes
    await runTestRetryIfDriverCrashes(
      async () => {
        const { handlesBeforeConnect, handlesAfterConnect } = await sendConnectionRequestAndReturnHandles()
        await goToNewWindowHandle(driver, handlesBeforeConnect, handlesAfterConnect)
        await connectWallet.checkOnConnectWallet()
        await connectWallet.approveConnectionAndCheckSuccess()
        expect(await isDriverInstanceClosed(driver, originalHandle)).toBe(true)
        await navigateToExtensionLandingPage(driver)
        expect((await apiHelper.listConnections()).length).toBe(1)
      },
      setupTests,
      tearDownTests
    )
  })

  it('connection request persists when popout dismissed', async () => {
    // 1113-POPT-002 If I close the pop-up window the connection persists
    await runTestRetryIfDriverCrashes(
      async () => {
        const { handlesBeforeConnect, handlesAfterConnect } = await sendConnectionRequestAndReturnHandles()
        await goToNewWindowHandle(driver, handlesBeforeConnect, handlesAfterConnect)
        await connectWallet.checkOnConnectWallet()
        await driver.close()
        expect(await windowHandleHasCount(driver, 2)).toBe(true)

        await switchWindowHandles(driver, false, originalHandle)
        await navigateToExtensionLandingPage(driver)
        await connectWallet.checkOnConnectWallet()
      },
      setupTests,
      tearDownTests
    )
  })

  it('connect request opens in popout and can be denied when extension not already open', async () => {
    // 1113-POPT-004 If I reject the connection the pop-up window closes
    await runTestRetryIfDriverCrashes(
      async () => {
        const { handlesBeforeConnect, handlesAfterConnect } = await sendConnectionRequestAndReturnHandles()
        await goToNewWindowHandle(driver, handlesBeforeConnect, handlesAfterConnect)
        await connectWallet.checkOnConnectWallet()
        await connectWallet.denyConnection()
        expect(await isDriverInstanceClosed(driver, originalHandle)).toBe(true)
      },
      setupTests,
      tearDownTests
    )
  })

  it('transaction request persists when popout dismissed without response', async () => {
    // 1113-POPT-006 If I close the pop-up window the transaction persists
    await runTestRetryIfDriverCrashes(
      async () => {
        const { handlesBeforeTransaction, handlesAfterTransaction } = await sendTransactionAndGetWindowHandles()
        await goToNewWindowHandle(driver, handlesBeforeTransaction, handlesAfterTransaction)
        await transaction.checkOnTransactionPage()
        await driver.close()

        await switchWindowHandles(driver, false)
        await navigateToExtensionLandingPage(driver)
        await transaction.checkOnTransactionPage()
      },
      setupTests,
      tearDownTests
    )
  })

  it('transaction request opens in popout and can be confirmed when extension not already open', async () => {
    // 1113-POPT-005 The browser wallet opens in a pop-up window when there is a transaction request
    // 1113-POPT-007 If I approve the transaction the pop-up window closes
    await runTestRetryIfDriverCrashes(
      async () => {
        const { handlesBeforeTransaction, handlesAfterTransaction } = await sendTransactionAndGetWindowHandles()
        await goToNewWindowHandle(driver, handlesBeforeTransaction, handlesAfterTransaction)
        await transaction.checkOnTransactionPage()
        await transaction.confirmTransaction()
        expect(await isDriverInstanceClosed(driver, originalHandle)).toBe(true)
      },
      setupTests,
      tearDownTests
    )
  })

  it('transaction request opens in popout and can be rejected when extension not already open', async () => {
    await runTestRetryIfDriverCrashes(
      async () => {
        // 1113-POPT-008 If I reject the transaction the pop-up window closes
        const { handlesBeforeTransaction, handlesAfterTransaction } = await sendTransactionAndGetWindowHandles()
        await goToNewWindowHandle(driver, handlesBeforeTransaction, handlesAfterTransaction)
        await transaction.checkOnTransactionPage()
        await transaction.rejectTransaction()
        expect(await isDriverInstanceClosed(driver, originalHandle)).toBe(true)
      },
      setupTests,
      tearDownTests
    )
  })

  async function sendTransactionAndGetWindowHandles() {
    const { handlesBeforeConnect, handlesAfterConnect } = await sendConnectionRequestAndReturnHandles()
    await goToNewWindowHandle(driver, handlesBeforeConnect, handlesAfterConnect)
    await connectWallet.checkOnConnectWallet()
    await connectWallet.approveConnectionAndCheckSuccess()
    expect(await isDriverInstanceClosed(driver, originalHandle)).toBe(true)

    await switchWindowHandles(driver, false)
    const keys = await vegaAPI.listKeys(false, false)
    const handlesBeforeTransaction = await driver.getAllWindowHandles()
    await vegaAPI.sendTransaction(keys[0].publicKey, { transfer: dummyTransaction }, false, false)
    expect(await windowHandleHasCount(driver, handlesBeforeTransaction.length + 1)).toBe(true)
    const handlesAfterTransaction = await driver.getAllWindowHandles()
    return { handlesBeforeTransaction, handlesAfterTransaction }
  }

  async function sendConnectionRequestAndReturnHandles() {
    const handlesBeforeDappWindow = await driver.getAllWindowHandles()
    dappHandle = await createDappWindowHandle()
    await driver.get('https://google.co.uk')
    await switchWindowHandles(driver, false, dappHandle)

    expect(await windowHandleHasCount(driver, handlesBeforeDappWindow.length + 1)).toBe(true)
    const handlesBeforeConnect = await driver.getAllWindowHandles()
    await vegaAPI.connectWallet(false, false)
    expect(await windowHandleHasCount(driver, handlesBeforeConnect.length + 1)).toBe(true)
    const handlesAfterConnect = await driver.getAllWindowHandles()
    return { handlesBeforeConnect, handlesAfterConnect }
  }

  async function createDappWindowHandle() {
    await vegaAPI.openNewWindow()
    dappHandle = await vegaAPI.getVegaDappWindowHandle()
    await switchWindowHandles(driver, false)
    return dappHandle
  }

  async function setupTests() {
    driver = await initDriver()
    vegaAPI = new VegaAPI(driver)
    connectWallet = new ConnectWallet(driver)
    apiHelper = new APIHelper(driver)
    transaction = new Transaction(driver)
    await navigateToExtensionLandingPage(driver)
    await setUpWalletAndKey(driver)
    originalHandle = await driver.getWindowHandle()
  }

  async function tearDownTests() {
    await captureScreenshot(driver, expect.getState().currentTestName as string)
    await driver.quit()
  }
})
