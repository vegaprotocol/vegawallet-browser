import { WebDriver } from 'selenium-webdriver'
import { captureScreenshot, initDriver } from './driver'
import { ViewWallet } from './page-objects/view-wallet'
import { navigateToLandingPage } from './wallet-helpers/common'
import { APIHelper } from './wallet-helpers/api-helpers'
import { VegaAPI } from './wallet-helpers/vega-api'
import { ConnectWallet } from './page-objects/connect-wallet'
import { Transaction } from './page-objects/transaction'
import { openNewWindowAndSwitchToIt } from './selenium-util'
import { closeServerAndWait, server } from './wallet-helpers/http-server'
import test from '../../config/test'
import { Login } from './page-objects/login'
import { EthereumKeyRotateSubmission } from '@vegaprotocol/protos/dist/vega/commands/v1/EthereumKeyRotateSubmission'

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

  const ethereumKeyRotateSubmission: EthereumKeyRotateSubmission = {
    targetBlock: BigInt(1),
    newAddress: 'testNewAddress',
    currentAddress: 'testCurrentAddress',
    submitterAddress: 'testSubmitterAddress',
    ethereumSignature: {
      value: 'testValue',
      algo: 'testAlgo',
      version: 1
    }
  }

  beforeEach(async () => {
    driver = await initDriver()
    viewWallet = new ViewWallet(driver)
    vegaAPI = new VegaAPI(driver)
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

  beforeAll(async () => {
    server.listen(test.test.mockPort)
  })

  afterEach(async () => {
    await captureScreenshot(driver, expect.getState().currentTestName as string)
    await driver.quit()
  })

  afterAll(async () => {
    await closeServerAndWait()
  })

  it('can confirm a transaction', async () => {
    // 1105-TRAN-001 When I view a transaction request I can choose to approve it
    const keys = await vegaAPI.listKeys()
    await vegaAPI.sendTransaction(keys[0].publicKey, { transfer: transferReq })
    await transaction.checkOnTransactionPage()
    await transaction.confirmTransaction()
    await viewWallet.checkOnViewWalletPage()
  })

  it('a bad transaction request results in an error', async () => {
    // 1105-TRAN-008 When the dapp requests a transaction type / or includes transaction details that we don't recognise, we don't present the transaction request in the wallet but provide an error to the dapp that feeds back that the transaction can not be processed
    const keys = await vegaAPI.listKeys()
    await vegaAPI.sendTransaction(keys[0].publicKey, { aCommandThatDoesNotExist: {} })
    const res = await vegaAPI.getTransactionResult()
    expect(res).toBe('Unsupported transaction type')
  })

  it('the result of the transaction request is fed back to the UI', async () => {
    // 1105-TRAN-002 When I approve a transaction the transaction gets signed and the approved status gets fed back to the dapp that requested it
    const keys = await vegaAPI.listKeys()
    await vegaAPI.sendTransaction(keys[0].publicKey, { transfer: transferReq })
    await transaction.checkOnTransactionPage()
    await transaction.confirmTransaction()
    const res = await vegaAPI.getTransactionResult()
    const result = JSON.parse(JSON.stringify(res))
    expect(await result.transactionHash).toMatch(/[0-9A-F]{64}/)
  })

  it('queues transactions when there is more than one', async () => {
    // 1105-TRAN-003 When I approve a transaction after I have approved it we revert to the next transaction if there's a queue OR we revert to the key view (the front / homepage)
    // 1105-TRAN-006 When I reject a transaction after I have rejected it we revert to the next transaction if there's a queue OR we revert to the key view (start / home page)
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

  it('receipt view not shown for unhandled request types', async () => {
    const keys = await vegaAPI.listKeys()
    await vegaAPI.sendTransaction(keys[0].publicKey, { ethereumKeyRotateSubmission: ethereumKeyRotateSubmission })
    await transaction.checkOnTransactionPage()
    const receiptViewPresent = await transaction.checkReceiptViewPresent()
    expect(
      receiptViewPresent,
      'receipt view was displayed. Expected it to not be displayed for ethereumKeyRotateSubmission',
      {
        showPrefix: false
      }
    ).toBe(false)
  })

  it('can reject a transaction', async () => {
    // 1105-TRAN-004 When I view a transaction request I can choose to reject it
    // 1105-TRAN-005 When I reject a transaction the transaction does not get signed and the rejected status gets fed back to the dapp that requested it
    const keys = await vegaAPI.listKeys()
    await vegaAPI.sendTransaction(keys[0].publicKey, { transfer: transferReq })
    await transaction.checkOnTransactionPage()
    const receiptViewPresent = await transaction.checkReceiptViewPresent()
    expect(receiptViewPresent, 'receipt view was not displayed. Expected it to be displayed for a transfer', {
      showPrefix: false
    }).toBe(true)
    await transaction.rejectTransaction()
    const resp = await vegaAPI.getTransactionResult()
    expect(resp).toBe('Transaction denied')
    await viewWallet.checkOnViewWalletPage()
  })

  it('can send a transaction to a locked wallet and respond on unlock', async () => {
    const keys = await vegaAPI.listKeys()
    await apiHelper.lockWallet()
    await navigateToLandingPage(driver)
    await vegaAPI.sendTransaction(keys[0].publicKey, { transfer: transferReq })
    const login = new Login(driver)
    await login.login()
    await transaction.checkOnTransactionPage()
    await transaction.rejectTransaction()
    await viewWallet.checkOnViewWalletPage()
  })

  it("1105-TRAN-007 When the dapp requests a transaction with a key we don't know about, we don't see a request in the wallet but instead send an error back to the dapp", async () => {
    const keyThatDoesNotExistInWallet = await vegaAPI.generateEncodedHexPublicKey()
    await vegaAPI.sendTransaction(keyThatDoesNotExistInWallet, { transfer: transferReq })
    await viewWallet.checkOnViewWalletPage()
    const response = await vegaAPI.getTransactionResult()
    expect(response).toBe('Unknown public key')
  })

  it('the transaction persists when the extension is re-opened and locked', async () => {
    // 1105-TRAN-009 When the user opens the extension (or it has automatically opened) they can immediately see a transaction request
    // 1105-TRAN-010 If the browser extension is closed during a transaction request, the request persists
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
