import { WebDriver } from 'selenium-webdriver'
import { ViewWallet } from './page-objects/view-wallet'
import { navigateToExtensionLandingPage, setUpWalletAndKey } from './helpers/wallet/wallet-setup'
import { ConnectWallet } from './page-objects/connect-wallet'
import { Transaction } from './page-objects/transaction'
import { VegaAPI } from './helpers/wallet/vega-api'
import { APIHelper } from './helpers/wallet/wallet-api'
import { captureScreenshot, initDriver } from './helpers/driver'
import { dummyTransaction } from './helpers/wallet/common-wallet-values'
import { NavPanel } from './page-objects/navpanel'
import { TransactionList } from './page-objects/transaction-list'

describe('Transactions list', () => {
  let driver: WebDriver
  let viewWallet: ViewWallet
  let vegaAPI: VegaAPI
  let connectWallet: ConnectWallet
  let apiHelper: APIHelper
  let transaction: Transaction
  let navPanel: NavPanel
  let transactionList: TransactionList

  //   const ethereumKeyRotateSubmission: EthereumKeyRotateSubmission = {
  //     targetBlock: BigInt(1),
  //     newAddress: 'testNewAddress',
  //     currentAddress: 'testCurrentAddress',
  //     submitterAddress: 'testSubmitterAddress',
  //     ethereumSignature: {
  //       value: 'testValue',
  //       algo: 'testAlgo',
  //       version: 1
  //     }
  //   }

  beforeEach(async () => {
    driver = await initDriver()
    viewWallet = new ViewWallet(driver)
    vegaAPI = new VegaAPI(driver)
    connectWallet = new ConnectWallet(driver)
    apiHelper = new APIHelper(driver)
    transaction = new Transaction(driver)
    navPanel = new NavPanel(driver)
    transactionList = new TransactionList(driver)
    await navigateToExtensionLandingPage(driver)
    await setUpWalletAndKey(driver)
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

  it('renders empty state', async () => {
    await navPanel.goToListTransactions()
    await transactionList.checkOnListTransactionsPage()
    await transactionList.checkListEmpty()
  })

  it('adds rejected transactions to the transactions list', async () => {
    // 1148-TXLS-007 When I reject a transaction that transaction is added to the list of transactions (<a name="1148-TXLS-007" href="#1148-TXLS-007"></a>)
    const keys = await vegaAPI.listKeys()
    await vegaAPI.sendTransaction(keys[0].publicKey, { transfer: dummyTransaction })
    await transaction.checkOnTransactionPage()
    await transaction.rejectTransaction()
    await viewWallet.checkOnViewWalletPage()
    await navPanel.goToListTransactions()
    await transactionList.checkOnListTransactionsPage()
    await transactionList.checkNumTransactions(0)
  })

  it('adds confirmed transactions to the transactions list', async () => {
    // 1148-TXLS-006 When I confirm a transaction that transaction is added to the list of transactions (<a name="1148-TXLS-006" href="#1148-TXLS-006"></a>)
    const keys = await vegaAPI.listKeys()
    await vegaAPI.sendTransaction(keys[0].publicKey, { transfer: dummyTransaction })
    await transaction.checkOnTransactionPage()
    await transaction.confirmTransaction()
    await viewWallet.checkOnViewWalletPage()
    await navPanel.goToListTransactions()
    await transactionList.checkOnListTransactionsPage()
    await transactionList.checkNumTransactions(1)
  })
})
