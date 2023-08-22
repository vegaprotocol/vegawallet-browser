import { WebDriver } from 'selenium-webdriver'
import { VegaAPI } from './wallet-helpers/vega-api'
import { ConnectWallet } from './page-objects/connect-wallet'
import { APIHelper } from './wallet-helpers/api-helpers'
import { captureScreenshot, initDriver } from './driver'
import { dummyTransaction, navigateToExtensionLandingPage, setUpWalletAndKey } from './wallet-helpers/common'
import { openLatestWindowHandle, switchWindowHandles, windowHandleHasCount } from './selenium-util'
import { Transaction } from './page-objects/transaction'

describe('check popout functionality', () => {
  let dappHandle = ''

  let driver: WebDriver
  let vegaAPI: VegaAPI
  let connectWallet: ConnectWallet
  let apiHelper: APIHelper
  let transaction: Transaction

  beforeEach(async () => {
    driver = await initDriver()
    vegaAPI = new VegaAPI(driver)
    connectWallet = new ConnectWallet(driver)
    apiHelper = new APIHelper(driver)
    transaction = new Transaction(driver)
    await navigateToExtensionLandingPage(driver)
    await setUpWalletAndKey(driver)
  })

  afterEach(async () => {
    await captureScreenshot(driver, expect.getState().currentTestName as string)
    await driver.quit()
  })

  it('connect request opens in popout and can be approved when extension not already open', async () => {
    // 1113-POPT-001 The browser wallet opens in a pop-up window when there is a connection request
    // 1113-POPT-003 If I approve the connection the pop-up window closes
    await sendConnectionRequestAndCheckPopoutWindowHandlePresent()

    await openLatestWindowHandle(driver)
    await connectWallet.checkOnConnectWallet()
    await connectWallet.approveConnectionAndCheckSuccess()
    expect(await windowHandleHasCount(driver, 1)).toBe(true)

    await switchWindowHandles(driver, false, dappHandle)
    await navigateToExtensionLandingPage(driver)
    expect((await apiHelper.listConnections()).length).toBe(1)
  })

  it('connection request persists when popout dismissed', async () => {
    // 1113-POPT-002 If I close the pop-up window the connection persists
    await sendConnectionRequestAndCheckPopoutWindowHandlePresent()

    await openLatestWindowHandle(driver)
    await connectWallet.checkOnConnectWallet()
    await driver.close()
    expect(await windowHandleHasCount(driver, 1)).toBe(true)

    await switchWindowHandles(driver, false, dappHandle)
    await navigateToExtensionLandingPage(driver)
    await connectWallet.checkOnConnectWallet()
  })

  it('connect request opens in popout and can be denied when extension not already open', async () => {
    // 1113-POPT-004 If I reject the connection the pop-up window closes
    await sendConnectionRequestAndCheckPopoutWindowHandlePresent()

    await openLatestWindowHandle(driver)
    await connectWallet.checkOnConnectWallet()
    await connectWallet.denyConnection()
    expect(await windowHandleHasCount(driver, 1)).toBe(true)
    await switchWindowHandles(driver, false, dappHandle)
  })

  it('transaction request persists when popout dismissed without response', async () => {
    // 1113-POPT-007 If I close the pop-up window the transaction persists
    await sendTransactionAndCheckPopoutAppears()
    await openLatestWindowHandle(driver)
    await transaction.checkOnTransactionPage()
    expect(await windowHandleHasCount(driver, 2)).toBe(true)
    await driver.close()
    await openLatestWindowHandle(driver)

    expect(await windowHandleHasCount(driver, 1)).toBe(true)
    await navigateToExtensionLandingPage(driver)
  })

  it('transaction request opens in popout and can be confirmed when extension not already open', async () => {
    // 1113-POPT-005 The browser wallet opens in a pop-up window when there is a transaction request
    // 1113-POPT-007 If I approve the transaction the pop-up window closes
    await sendTransactionAndCheckPopoutAppears()
    await openLatestWindowHandle(driver)
    await transaction.checkOnTransactionPage()
    await transaction.confirmTransaction()
    expect(await windowHandleHasCount(driver, 1)).toBe(true)
    await switchWindowHandles(driver, false, dappHandle)
  })

  it('transaction request opens in popout and can be rejected when extension not already open', async () => {
    // 1113-POPT-008 If I reject the transaction the pop-up window closes
    await sendTransactionAndCheckPopoutAppears()
    await openLatestWindowHandle(driver)
    await transaction.checkOnTransactionPage()
    await transaction.rejectTransaction()
    expect(await windowHandleHasCount(driver, 1)).toBe(true)
    await switchWindowHandles(driver, false, dappHandle)
  })

  async function sendTransactionAndCheckPopoutAppears() {
    await sendConnectionRequestAndCheckPopoutWindowHandlePresent()
    await openLatestWindowHandle(driver)
    await connectWallet.checkOnConnectWallet()
    await connectWallet.approveConnectionAndCheckSuccess()

    const keys = await vegaAPI.listKeys(false, false)
    const handles = await driver.getAllWindowHandles()
    expect(handles.length).toBe(1)
    await vegaAPI.sendTransaction(keys[0].publicKey, { transfer: dummyTransaction }, false, false)
    expect(await windowHandleHasCount(driver, 2)).toBe(true)
  }

  async function sendConnectionRequestAndCheckPopoutWindowHandlePresent() {
    dappHandle = await createDappWindowHandle()
    await driver.close()
    await switchWindowHandles(driver, false, dappHandle)

    expect(await windowHandleHasCount(driver, 1)).toBe(true)
    await vegaAPI.connectWallet(false, false)
    expect(await windowHandleHasCount(driver, 2)).toBe(true)
  }

  async function createDappWindowHandle() {
    await vegaAPI.openNewWindow()
    const dappHandle = await vegaAPI.getVegaDappWindowHandle()
    await switchWindowHandles(driver, false)
    return dappHandle
  }
})
