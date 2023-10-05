import { WebDriver } from 'selenium-webdriver'
import { VegaAPI } from './helpers/wallet/vega-api'
import { ConnectWallet } from './page-objects/connect-wallet'
import { APIHelper } from './helpers/wallet/wallet-api'
import { captureScreenshot, initDriver } from './helpers/driver'
import { dummyTransaction } from './helpers/wallet/common-wallet-values'
import { openLatestWindowHandle, switchWindowHandles, windowHandleHasCount } from './helpers/selenium-util'
import { Transaction } from './page-objects/transaction'
import { navigateToExtensionLandingPage, setUpWalletAndKey } from './helpers/wallet/wallet-setup'

describe('check popout functionality', () => {
  let dappHandle = ''
  let driver: WebDriver
  let vegaAPI: VegaAPI
  let connectWallet: ConnectWallet
  let apiHelper: APIHelper
  let transaction: Transaction

  const ecr20 = {
    receiverAddress: '0xcb84d72e61e383767c4dfeb2d8ff7f4fb89abc6e'
  }

  const withdrawSubmission = {
    amount: '100000000000000000000000000000000000000',
    asset: 'fc7fd956078fb1fc9db5c19b88f0874c4299b2a7639ad05a47a28c0aef291b55',
    ext: {
      erc20: ecr20
    }
  }

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
    //await driver.quit()
  })

  it('connect request opens in popout and can be approved when extension not already open', async () => {
    // 1113-POPT-001 The browser wallet opens in a pop-up window when there is a connection request
    // 1113-POPT-003 If I approve the connection the pop-up window closes
    await sendConnectionRequestAndCheckPopoutWindowHandlePresent()

    await openLatestWindowHandle(driver)
    await connectWallet.checkOnConnectWallet()
    await connectWallet.approveConnectionAndCheckSuccess()
    expect(await windowHandleHasCount(driver, 2)).toBe(true)

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
    expect(await windowHandleHasCount(driver, 2)).toBe(true)

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
    expect(await windowHandleHasCount(driver, 2)).toBe(true)
    await switchWindowHandles(driver, false, dappHandle)
  })

  it('transaction request persists when popout dismissed without response', async () => {
    // 1113-POPT-006 If I close the pop-up window the transaction persists
    await sendTransactionAndCheckPopoutAppears()
    await openLatestWindowHandle(driver)
    await transaction.checkOnTransactionPage()
    // expect(await windowHandleHasCount(driver, 3)).toBe(true)
    // await driver.close()

    // await switchWindowHandles(driver, false, dappHandle)
    // expect(await windowHandleHasCount(driver, 2)).toBe(true)
  })

  it('transaction request opens in popout and can be confirmed when extension not already open', async () => {
    // 1113-POPT-005 The browser wallet opens in a pop-up window when there is a transaction request
    // 1113-POPT-007 If I approve the transaction the pop-up window closes
    await sendTransactionAndCheckPopoutAppears()
    await openLatestWindowHandle(driver)
    await transaction.checkOnTransactionPage()
    await transaction.confirmTransaction()

    await switchWindowHandles(driver, false, dappHandle)
    expect(await windowHandleHasCount(driver, 2)).toBe(true)
  })

  it('transaction request opens in popout and can be rejected when extension not already open', async () => {
    // 1113-POPT-008 If I reject the transaction the pop-up window closes
    await sendTransactionAndCheckPopoutAppears()
    await openLatestWindowHandle(driver)
    await transaction.checkOnTransactionPage()
    await transaction.rejectTransaction()

    await switchWindowHandles(driver, false, dappHandle)
    expect(await windowHandleHasCount(driver, 2)).toBe(true)
  })

  async function sendTransactionAndCheckPopoutAppears() {
    await sendConnectionRequestAndCheckPopoutWindowHandlePresent()
    await openLatestWindowHandle(driver)
    await connectWallet.checkOnConnectWallet()
    await connectWallet.approveConnectionAndCheckSuccess()

    const keys = await vegaAPI.listKeys(false, false)
    const handles = await driver.getAllWindowHandles()
    expect(handles.length).toBe(2)
    await vegaAPI.sendTransaction(keys[0].publicKey, { withdrawSubmission: withdrawSubmission }, false, false)
    expect(await windowHandleHasCount(driver, 3)).toBe(true)
  }

  async function sendConnectionRequestAndCheckPopoutWindowHandlePresent() {
    dappHandle = await createDappWindowHandle()
    await driver.get('http://google.co.uk')
    await switchWindowHandles(driver, false, dappHandle)

    expect(await windowHandleHasCount(driver, 2)).toBe(true)
    await vegaAPI.connectWallet(false, false)
    expect(await windowHandleHasCount(driver, 3)).toBe(true)
  }

  async function createDappWindowHandle() {
    await vegaAPI.openNewWindow()
    const dappHandle = await vegaAPI.getVegaDappWindowHandle()
    await switchWindowHandles(driver, false)
    return dappHandle
  }
})
