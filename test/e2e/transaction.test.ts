import { WebDriver } from 'selenium-webdriver'
import { captureScreenshot, initDriver } from './driver'
import { ViewWallet } from './page-objects/view-wallet'
import { navigateToLandingPage } from './wallet-helpers/common'
import { APIHelper } from './wallet-helpers/api-helpers'
import { VegaAPI } from './wallet-helpers/vega-api'
import { ConnectWallet } from './page-objects/connect-wallet'
import { Transaction } from './page-objects/transaction'
import { openNewWindowAndSwitchToIt } from './selenium-util'

describe('transactions', () => {
  let driver: WebDriver
  let viewWallet: ViewWallet
  let vegaAPI: VegaAPI
  let connectWallet: ConnectWallet
  let apiHelper: APIHelper
  let transaction: Transaction

  // TODO better typing
  const transferReq = {
    fromAccountType: 4,
    toAccountType: 4,
    amount: '1',
    asset: 'fc7fd956078fb1fc9db5c19b88f0874c4299b2a7639ad05a47a28c0aef291b55',
    to: 'fc7fd956078fb1fc9db5c19b88f0874c4299b2a7639ad05a47a28c0aef291b55',
    kind: {
      oneOff: {}
    }
  }

  beforeEach(async () => {
    driver = await initDriver()
    viewWallet = new ViewWallet(driver)
    vegaAPI = new VegaAPI(driver, await driver.getWindowHandle())
    connectWallet = new ConnectWallet(driver)
    apiHelper = new APIHelper(driver)
    transaction = new Transaction(driver)
    await navigateToLandingPage(driver)
    await setUpWalletAndKey()
    await vegaAPI.connectWalletAndCheckSuccess()
    await connectWallet.checkOnConnectWallet()
    await connectWallet.approveConnectionAndCheckSuccess()
    expect(await vegaAPI.getConnectionResult()).toBe(null)
    await viewWallet.checkOnViewWalletPage()
  })

  afterEach(async () => {
    await captureScreenshot(driver, expect.getState().currentTestName as string)
    await driver.quit()
  })

  it('can confirm a transaction', async () => {
    // 1101-BWAL-044 When I view a transaction request I can choose to approve it
    const keys = await vegaAPI.listKeys()
    await vegaAPI.sendTransaction(keys[0].publicKey, { transfer: transferReq })
    await transaction.checkOnTransactionPage()
    await transaction.confirmTransaction()
    await viewWallet.checkOnViewWalletPage()
  })

  it('a bad transaction request results in an error', async () => {
    // 1101-BWAL-051 When the dapp requests a transaction type / or includes transaction details that we don't recognise, we don't present the transaction request in the wallet but provide an error to the dapp that feeds back that the transaction can not be processed
    const keys = await vegaAPI.listKeys()
    await vegaAPI.sendTransaction(keys[0].publicKey, { aCommandThatDoesNotExist: {} })
    const res = await vegaAPI.getTransactionResult()
    expect(res).toBe('`transaction` must contain only one of the valid commands')
  })

  it('the result of the transaction request is fed back to the UI', async () => {
    // TODO intercept this request and validate that a good result is fed back
    // 1101-BWAL-045 When I approve a transaction the transaction gets signed and the approved status gets fed back to the dapp that requested it
    const keys = await vegaAPI.listKeys()
    await vegaAPI.sendTransaction(keys[0].publicKey, { transfer: transferReq })
    await transaction.checkOnTransactionPage()
    await transaction.confirmTransaction()
    const res = await vegaAPI.getTransactionResult()
    expect(res).toBe('Internal error')
  })

  it('queues transactions when there is more than one', async () => {
    // 1101-BWAL-046 When I approve a transaction after I have approved it we revert to the next transaction if there's a queue OR we revert to the key view (the front / homepage)
    // 1101-BWAL-049 When I reject a transaction after I have rejected it we revert to the next transaction if there's a queue OR we revert to the key view (start / home page)
    const keys = await vegaAPI.listKeys()
    await vegaAPI.sendTransaction(keys[0].publicKey, { transfer: transferReq })
    await vegaAPI.sendTransaction(keys[0].publicKey, { transfer: transferReq })
    await transaction.checkOnTransactionPage()
    await transaction.confirmTransaction()
    await transaction.checkOnTransactionPage()
    await transaction.confirmTransaction()
    await viewWallet.checkOnViewWalletPage()
    await vegaAPI.sendTransaction(keys[0].publicKey, { transfer: transferReq })
    await vegaAPI.sendTransaction(keys[0].publicKey, { transfer: transferReq })
    await transaction.checkOnTransactionPage()
    await transaction.rejectTransaction()
    await transaction.checkOnTransactionPage()
    await transaction.rejectTransaction()
    await viewWallet.checkOnViewWalletPage()
  })

  it('can reject a transaction', async () => {
    // 1101-BWAL-047 When I view a transaction request I can choose to reject it
    // 1101-BWAL-048 When I reject a transaction the transaction does not get signed and the rejected status gets fed back to the dapp that requested it
    const keys = await vegaAPI.listKeys()
    await vegaAPI.sendTransaction(keys[0].publicKey, { transfer: transferReq })
    await transaction.checkOnTransactionPage()
    await transaction.rejectTransaction()
    const resp = await vegaAPI.getTransactionResult()
    expect(resp).toBe('Transaction denied')
    await viewWallet.checkOnViewWalletPage()
  })

  it("1101-BWAL-050 When the dapp requests a transaction with a key we don't know about, we don't see a request in the wallet but instead send an error back to the dapp", async () => {
    const keyThatDoesNotExistInWallet = await vegaAPI.generateEncodedHexPublicKey()
    await vegaAPI.sendTransaction(keyThatDoesNotExistInWallet, { transfer: transferReq })
    await viewWallet.checkOnViewWalletPage()
    const response = await vegaAPI.getTransactionResult()
    expect(response).toBe('Unknown public key')
  })

  it('the transaction persists when the extension is re-opened and locked', async () => {
    // 1101-BWAL-052 When the user opens the extension (or it has automatically opened) they can immediately see a transaction request
    // 1101-BWAL-053 If the browser extension is closed during a transaction request, the request persists
    const keys = await vegaAPI.listKeys()
    await vegaAPI.sendTransaction(keys[0].publicKey, { transfer: transferReq })
    await transaction.checkOnTransactionPage()
    await openNewWindowAndSwitchToIt(driver, true)
    await navigateToLandingPage(driver)
    await apiHelper.lockWallet()
    await apiHelper.login()
    await navigateToLandingPage(driver)
    await transaction.checkOnTransactionPage()
  })

  async function setUpWalletAndKey() {
    await apiHelper.setUpWalletAndKey()
    await navigateToLandingPage(driver)
  }
})
