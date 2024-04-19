import { WebDriver } from 'selenium-webdriver'
import { captureScreenshot, initDriver } from './helpers/driver'
import { ViewWallet } from './page-objects/view-wallet'
import { APIHelper } from './helpers/wallet/wallet-api'
import { VegaAPI } from './helpers/wallet/vega-api'
import { ConnectWallet } from './page-objects/connect-wallet'
import { navigateToExtensionLandingPage, setUpWalletAndKey } from './helpers/wallet/wallet-setup'
import { Transaction } from './page-objects/transaction'
import { EthereumKeyRotateSubmission } from '@vegaprotocol/protos/vega/commands/v1/EthereumKeyRotateSubmission'
import { testDAppUrl } from './helpers/wallet/common-wallet-values'
import { VoteSubmission } from '@vegaprotocol/protos/vega/commands/v1/VoteSubmission'
import { Value } from '@vegaprotocol/protos/vega/Vote'

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

  const voteSubmission: VoteSubmission = {
    proposalId: 'proposalId',
    value: Value.VALUE_YES
  }

  const connectedPage = new URL(testDAppUrl)

  beforeEach(async () => {
    driver = await initDriver()
    viewWallet = new ViewWallet(driver)
    vegaAPI = new VegaAPI(driver)
    connectWallet = new ConnectWallet(driver)
    apiHelper = new APIHelper(driver)
    transaction = new Transaction(driver)
  })

  const setupTest = async (autoConsent: boolean) => {
    await navigateToExtensionLandingPage(driver)
    await setUpWalletAndKey(driver)
    await vegaAPI.connectWalletAndCheckSuccess()
    await connectWallet.checkOnConnectWallet()
    await connectWallet.approveConnectionAndCheckSuccess()
    await apiHelper.updateConnection(connectedPage.origin, autoConsent)
    expect(await vegaAPI.getConnectionResult()).toBe(null)
    await viewWallet.checkOnViewWalletPage()
    await navigateToExtensionLandingPage(driver)
  }

  afterEach(async () => {
    await captureScreenshot(driver, expect.getState().currentTestName as string)
    await driver.quit()
  })

  it('behaves as per normal if autoConsent is not set', async () => {
    // 1146-ATCN-001 - Given I have not set the autoConsent option, when I send a transaction, then I am asked for consent to approve the transaction
    await setupTest(false)
    const keys = await vegaAPI.listKeys()
    await vegaAPI.sendTransaction(keys[0].publicKey, { ethereumKeyRotateSubmission })
    await transaction.checkOnTransactionPage()
    await transaction.confirmTransaction()
    await viewWallet.checkOnViewWalletPage()
  })

  it('automatically approves order and vote transactions when auto consent is on', async () => {
    // 1146-ATCN-002 - Given I have set autoConsent as true and the wallet is unlocked, when I send a transaction that can be approved with autoConsent then I am not asked for consent
    await setupTest(true)

    const keys = await vegaAPI.listKeys()
    await vegaAPI.sendTransaction(keys[0].publicKey, { voteSubmission })
    await viewWallet.checkOnViewWalletPage()
  })

  it('requires consent if the transaction type if cannot be auto approves', async () => {
    // 1146-ATCN-003 - Given I have set autoConsent as true and the wallet is unlocked, when I send a transaction that cannot be approved with autoConsent then I am asked for consent
    await setupTest(true)

    const keys = await vegaAPI.listKeys()
    await vegaAPI.sendTransaction(keys[0].publicKey, { ethereumKeyRotateSubmission })
    await transaction.checkOnTransactionPage()
    await transaction.confirmTransaction()
    await viewWallet.checkOnViewWalletPage()
  })

  it('requires consent for all transactions when the wallet is locked', async () => {
    // 1146-ATCN-004 - Given I have set autoConsent as true and the wallet is locked, when I send a transaction that can be approved with autoConsent then I am still asked for consent
    await setupTest(true)

    const keys = await vegaAPI.listKeys()
    await apiHelper.lockWallet()
    await vegaAPI.sendTransaction(keys[0].publicKey, { voteSubmission })
    await apiHelper.login()
    await await transaction.checkOnTransactionPage()
    await transaction.confirmTransaction()
    await viewWallet.checkOnViewWalletPage()
  })

  it('allows me to set autoConsent on the transaction modal if unset', async () => {
    // 1146-ATCN-005 - Given I have not set autoConsent and the current transaction can be approved with autoConsent then I am prompted on the transaction modal to set this, with an explanation
    // 1146-ATCN-006 - Given I select the autoConsent prompt on the transaction modal then auto consent is now set to true
    await setupTest(false)

    const keys = await vegaAPI.listKeys()
    await vegaAPI.sendTransaction(keys[0].publicKey, { voteSubmission })
    await transaction.checkOnTransactionPage()
    const autoConsentPrompt = await transaction.isAutoConsentPromptVisible()
    expect(autoConsentPrompt).toBe(true)
    await transaction.confirmTransaction()
    await viewWallet.checkOnViewWalletPage()
  })

  it('once selecting autoConsent on the transaction modal, I am not prompted to change this', async () => {
    // 1146-ATCN-007 - Given I have set autoConsent to true, then I am not prompted on the transaction modal to set autoConsent when approving an auto approvable transaction (i.e. if a transaction was sent while wallet was locked)
    await setupTest(true)

    const keys = await vegaAPI.listKeys()
    await vegaAPI.sendTransaction(keys[0].publicKey, { ethereumKeyRotateSubmission })
    await transaction.checkOnTransactionPage()
    const autoConsentPrompt = await transaction.isAutoConsentPromptVisible()
    expect(autoConsentPrompt).toBe(false)
    await transaction.confirmTransaction()
    await viewWallet.checkOnViewWalletPage()
  })

  it('should not prompt if the transaction is not automatically approveable', async () => {
    // 1146-ATCN-008 - Given I have set autoConsent to false, and the current transaction cannot be approved with autoConsent then I am not prompted on the transaction modal
    await setupTest(false)

    const keys = await vegaAPI.listKeys()
    await vegaAPI.sendTransaction(keys[0].publicKey, { ethereumKeyRotateSubmission })
    await transaction.checkOnTransactionPage()
    const autoConsentPrompt = await transaction.isAutoConsentPromptVisible()
    expect(autoConsentPrompt).toBe(false)
    await transaction.confirmTransaction()
    await viewWallet.checkOnViewWalletPage()
  })
})
