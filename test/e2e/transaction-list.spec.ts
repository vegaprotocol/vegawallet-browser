import { WebDriver } from 'selenium-webdriver'
import { ViewWallet } from './page-objects/view-wallet'
import { navigateToExtensionLandingPage, setUpWalletAndKey } from './helpers/wallet/wallet-setup'
import { ConnectWallet } from './page-objects/connect-wallet'
import { Transaction } from './page-objects/transaction'
import { Login } from './page-objects/login'
import { EthereumKeyRotateSubmission } from '@vegaprotocol/protos/vega/commands/v1/EthereumKeyRotateSubmission'
import { VegaAPI } from './helpers/wallet/vega-api'
import { APIHelper } from './helpers/wallet/wallet-api'
import { captureScreenshot, initDriver } from './helpers/driver'
import { openNewWindowAndSwitchToIt } from './helpers/selenium-util'
import { dummyTransaction } from './helpers/wallet/common-wallet-values'
import { NavPanel } from './page-objects/navpanel'

describe('Transactions list', () => {
  let driver: WebDriver
  let viewWallet: ViewWallet
  let vegaAPI: VegaAPI
  let connectWallet: ConnectWallet
  let apiHelper: APIHelper
  let transaction: Transaction
  let navPanel: NavPanel

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

  it('rejected transactions are shown in transaction list', async () => {
    const keys = await vegaAPI.listKeys()
    await vegaAPI.sendTransaction(keys[0].publicKey, { transfer: dummyTransaction })
    await transaction.checkOnTransactionPage()
    await transaction.rejectTransaction()
    await viewWallet.checkOnViewWalletPage()
    await navPanel.goToListTransactions()
  })
})
