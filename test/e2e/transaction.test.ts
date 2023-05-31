import { WebDriver } from 'selenium-webdriver'
import { captureScreenshot, initDriver } from './driver'
import { ViewWallet } from './page-objects/view-wallet'
import { navigateToLandingPage } from './wallet-helpers/common'
import { APIHelper } from './wallet-helpers/api-helpers'
import { VegaAPI } from './wallet-helpers/vega-api'
import { ConnectWallet } from './page-objects/connect-wallet'
import { TransferRequest } from '@vegaprotocol/protos/dist/vega/TransferRequest'
import { TransferType } from '@vegaprotocol/protos/dist/vega/TransferType'
import { Transaction } from './page-objects/transaction'
import { openNewWindowAndSwitchToIt } from './selenium-util'

describe('transactions', () => {
  let driver: WebDriver
  let viewWallet: ViewWallet
  let vegaAPI: VegaAPI
  let connectWallet: ConnectWallet
  let apiHelper: APIHelper
  let transaction: Transaction

  const transferReq: TransferRequest = {
    fromAccount: [],
    toAccount: [],
    amount: '',
    minAmount: '',
    asset: '',
    type: 0
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
    //check for confirmation (does not exist yet!)
    await viewWallet.checkOnViewWalletPage()
  })

  it('queues transactions when there is more than one', async () => {
    // 1101-BWAL-047 When I approve a transaction after I have approved it we revert to the next transaction if there's a queue OR we revert to the key view (the front / homepage)
    // 1101-BWAL-051 When I reject a transaction after I have rejected it we revert to the next transaction if there's a queue OR we revert to the key view (start / home page)
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
    //check for confirmation (does not exist yet!)
    await transaction.rejectTransaction()
    //check for confirmation (does not exist yet!)
    await viewWallet.checkOnViewWalletPage()
  })

  it('can reject a transaction', async () => {
    // 1101-BWAL-048 When I view a transaction request I can choose to reject it
    const keys = await vegaAPI.listKeys()
    await vegaAPI.sendTransaction(keys[0].publicKey, { transfer: transferReq })
    await transaction.checkOnTransactionPage()
    await transaction.rejectTransaction()
    //check for confirmation (does not exist yet!)
    await viewWallet.checkOnViewWalletPage()
  })

  it('the transaction persists when the extension is opened', async () => {
    // 1101-BWAL-054 When the user opens the extension (or it has automatically opened) they can immediately see a transaction request
    const keys = await vegaAPI.listKeys()
    await vegaAPI.sendTransaction(keys[0].publicKey, { transfer: transferReq })
    await transaction.checkOnTransactionPage()
    await openNewWindowAndSwitchToIt(driver)
    await apiHelper.lockWallet()
    await apiHelper.login('password1')
    await transaction.checkOnTransactionPage()
  })

  async function setUpWalletAndKey() {
    await apiHelper.setUpWalletAndKey()
    await navigateToLandingPage(driver)
  }

  async function assertNumberOfKeys(expectedNumber: number) {
    const keys = await vegaAPI.listKeys()
    expect(keys.length, `expected to be able to view 2 wallet keys, instead found ${keys.length}`).toBe(expectedNumber)
  }
})
