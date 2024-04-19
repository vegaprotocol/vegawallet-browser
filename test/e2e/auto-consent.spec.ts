import { WebDriver } from 'selenium-webdriver'
import { captureScreenshot, initDriver } from './helpers/driver'
import { ViewWallet } from './page-objects/view-wallet'
import { APIHelper } from './helpers/wallet/wallet-api'
import { VegaAPI } from './helpers/wallet/vega-api'
import { ConnectWallet } from './page-objects/connect-wallet'
import { navigateToExtensionLandingPage, setUpWalletAndKey } from './helpers/wallet/wallet-setup'
import { Transaction } from './page-objects/transaction'
import { EthereumKeyRotateSubmission } from '@vegaprotocol/protos/vega/commands/v1/EthereumKeyRotateSubmission'

describe('AutomaticConsent', () => {
  let driver: WebDriver
  let viewWallet: ViewWallet
  let vegaAPI: VegaAPI
  let connectWallet: ConnectWallet
  let apiHelper: APIHelper
  let transaction: Transaction

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
    await navigateToExtensionLandingPage(driver)
    await setUpWalletAndKey(driver)
    await vegaAPI.connectWalletAndCheckSuccess()
    await connectWallet.checkOnConnectWallet()
    await connectWallet.approveConnectionAndCheckSuccess()
    expect(await vegaAPI.getConnectionResult()).toBe(null)
    await viewWallet.checkOnViewWalletPage()
  })

  // - Given I have not set the autoConsent option, when I send a transaction, then I am asked for consent to approve the transaction (<a name="1146-ATCN-001" href="#1146-ATCN-001">1146-ATCN-001</a>)
  it('behaves as per normal if autoConsent is not set', () => {})
  // - Given I have set autoConsent as true and the wallet is unlocked, when I send a transaction that can be approved with autoConsent then I am not asked for consent (<a name="1146-ATCN-002" href="#1146-ATCN-002">1146-ATCN-002</a>)
  it('automatically approves order and vote transactions when auto constent is on', () => {})
  // - Given I have set autoConsent as true and the wallet is unlocked, when I send a transaction that cannot be approved with autoConsent then I am asked for consent (<a name="1146-ATCN-003" href="#1146-ATCN-003">1146-ATCN-003</a>)
  it('requires consent if the transaction type if cannot be auto approves', () => {})
  // - Given I have set autoConsent as true and the wallet is locked, when I send a transaction that can be approved with autoConsent then I am still asked for consent (<a name="1146-ATCN-004" href="#1146-ATCN-004">1146-ATCN-004</a>)
  it('requires consent for all transactions when the wallet is locked', () => {})
  // - Given I have not set autoConsent and the current transaction can be approved with autoConsent then I am prompted on the transaction modal to set this, with an explanation (<a name="1146-ATCN-005" href="#1146-ATCN-005">1146-ATCN-005</a>)
  // - Given I select the autoConsent prompt on the transaction modal then auto consent is now set to true (<a name="1146-ATCN-006" href="#1146-ATCN-006">1146-ATCN-006</a>)
  it('allows me to set autoConsent on the transaction modal if unset', () => {})
  // - Given I have set autoConsent to true, then I am not prompted on the transaction modal to set autoConsent when approving an auto approvable transaction (i.e. if a transaction was sent while wallet was locked) (<a name="1146-ATCN-007" href="#1146-ATCN-007">1146-ATCN-007</a>)
  it('once selecting autoConsent on the transaction modal, I am not prompted to change this', () => {})
})
