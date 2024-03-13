import { WebDriver } from 'selenium-webdriver'
import { captureScreenshot, initDriver } from './helpers/driver'
import { GetStarted } from './page-objects/get-started'
import { Password } from './page-objects/password'
import { SecureYourWallet } from './page-objects/secure-your-wallet'
import { CreateAWallet } from './page-objects/create-a-wallet'
import { ViewWallet } from './page-objects/view-wallet'
import { defaultPassword, validRecoveryPhrase } from './helpers/wallet/common-wallet-values'
import { APIHelper } from './helpers/wallet/wallet-api'
// import { Telemetry } from './page-objects/telemetry-opt-in'
import { navigateToExtensionLandingPage } from './helpers/wallet/wallet-setup'
import test from '../../config/test'

const incorrectRecoveryPhrase =
  'solid length discover gun swear nose artwork unfair vacuum canvas push hybrid owner wasp arrest mixed oak miss cage scatter tree harsh critic bob'

describe('Onboarding', () => {
  let driver: WebDriver
  let getStarted: GetStarted
  let password: Password
  let secureYourWallet: SecureYourWallet
  let createAWallet: CreateAWallet
  let viewWallet: ViewWallet
  // let telemetry: Telemetry

  beforeEach(async () => {
    driver = await initDriver()
    password = new Password(driver)
    getStarted = new GetStarted(driver)
    secureYourWallet = new SecureYourWallet(driver)
    createAWallet = new CreateAWallet(driver)
    viewWallet = new ViewWallet(driver)
    // telemetry = new Telemetry(driver)
    await navigateToExtensionLandingPage(driver)
    await getStarted.getStarted()
  })

  afterEach(async () => {
    await captureScreenshot(driver, expect.getState().currentTestName as string)
    await driver.quit()
  })

  it('can create a new wallet and remember that a wallet has been created when I navigate back to the landing page', async () => {
    // 1101-ONBD-007 I can submit the password I entered
    // 1101-ONBD-008 When I have submitted my new password, I am taken to the next step
    // 1101-ONBD-012 I can choose to create a wallet
    // 1101-ONBD-021 I am given feedback that my wallet was successfully created
    // 1101-ONBD-023 I am redirected to the next step - opt in to error reporting
    // 1101-ONBD-024 The new Wallet name and key pair are auto generated in the background "Wallet" "Vega Key 1" #
    // 1101-ONBD-025 When I have already created a wallet, I am redirected to the landing page where I can view that wallet
    // 1101-ONBD-014 I am given visual feedback that my wallet was successfully created
    // 1111-TELE-003 I can opt in to reporting bugs and crashes
    await password.createPassword()
    await createAWallet.createNewWallet()
    await secureYourWallet.revealRecoveryPhrase(true)
    await secureYourWallet.checkCreateWalletSuccessful()
    // await telemetry.optIn()
    await checkOnWalletPageWithExpectedWalletAndKeys('Wallet 1', 'Key 0')
    await navigateToExtensionLandingPage(driver)
    await checkOnWalletPageWithExpectedWalletAndKeys('Wallet 1', 'Key 0')
  })

  it('can successfully import a wallet', async () => {
    // 1101-ONBD-013 I can choose to import an existing wallet
    // 1101-ONBD-027 I can enter the recovery phrase to import my existing vega wallet
    // 1101-ONBD-028 I can submit the recovery phrase I have entered to import the wallet
    // 1101-ONBD-031 I am redirected to the next step
    // 1101-ONBD-015 I am given visual feedback that my wallet was successfully imported
    // 1111-TELE-004 I can opt out of reporting bugs and crashes
    const apiHelper = new APIHelper(driver)
    await navigateToExtensionLandingPage(driver)
    await apiHelper.createPassphraseAndCheckSuccess()
    await navigateToExtensionLandingPage(driver)
    const importWallet = await createAWallet.importWallet()
    await importWallet.fillInRecoveryPhraseAndSubmit(validRecoveryPhrase)
    await importWallet.checkImportWalletSuccessful()
    // await telemetry.optOut()
    await viewWallet.checkOnViewWalletPage()
  })

  it('shows an error when recovery phrase is incorrect', async () => {
    const apiHelper = new APIHelper(driver)
    await navigateToExtensionLandingPage(driver)
    await apiHelper.createPassphraseAndCheckSuccess()
    await navigateToExtensionLandingPage(driver)
    const importWallet = await createAWallet.importWallet()
    await importWallet.fillInRecoveryPhraseAndSubmit(incorrectRecoveryPhrase)
    const errorText = await importWallet.getErrorMessageText()
    expect(errorText).toBeTruthy() //Improve this assertion before merging! Once validation is added.
    await importWallet.fillInRecoveryPhraseAndSubmit(validRecoveryPhrase)
    // await telemetry.optOut()
    await viewWallet.checkOnViewWalletPage()
  })

  it('can navigate back to the getting started page if no password submitted', async () => {
    // 1101-ONBD-001 When I haven't submitted my password, I can go back to the previous step
    await password.createPassword(defaultPassword, defaultPassword, false)
    await password.goBack()
    await getStarted.checkOnGetStartedPage()
  })

  it('navigating back after revealing recovery phrase causes new recovery phrase to be created', async () => {
    // 1101-ONBD-037 I can go back from secure your wallet to the import/create wallet decision page
    // 1101-ONBD-038 If I click back on the secure your wallet page after revealing a recovery phrase, I see a new recovery phrase if I select 'Create Wallet' again
    await password.createPassword()
    await createAWallet.createNewWallet()
    expect(await secureYourWallet.isRecoveryPhraseHidden()).toBe(true)
    await secureYourWallet.revealRecoveryPhrase()
    const initialRecoveryPhrase = await secureYourWallet.getRecoveryPhraseText()
    await secureYourWallet.goBack()
    await createAWallet.checkOnCreateWalletPage()
    await createAWallet.createNewWallet()
    expect(await secureYourWallet.isRecoveryPhraseHidden()).toBe(true)
    await secureYourWallet.revealRecoveryPhrase()
    const newRecoveryPhrase = await secureYourWallet.getRecoveryPhraseText()
    expect(initialRecoveryPhrase).not.toBe(newRecoveryPhrase)
  })

  it('shows an error message when passwords differ', async () => {
    await password.createPassword(defaultPassword, defaultPassword + '2')
    expect(await password.getErrorMessageText()).toBe('Passwords do not match')
    await password.checkOnCreatePasswordPage()
  })

  it('recovery phrase can be revealed and hidden, cannot continue without revealing and acknowledging warning', async () => {
    // 1101-ONBD-016 - My recovery phrase is rendered in a hidden container
    await password.createPassword()
    await createAWallet.createNewWallet()
    expect(await secureYourWallet.isRecoveryPhraseHidden()).toBe(true)
    expect(
      await secureYourWallet.isContinueEnabled(),
      'expected to be unable to proceed without revealing the recovery phrase',
      { showPrefix: false }
    ).toBe(false)
    await secureYourWallet.revealRecoveryPhrase()
    expect(await secureYourWallet.isRecoveryPhraseDisplayed()).toBe(true)
    expect(
      await secureYourWallet.isContinueEnabled(),
      'expected to be unable to proceed without enabling the checkbox',
      { showPrefix: false }
    ).toBe(false)

    await secureYourWallet.hideRecoveryPhrase()
    expect(await secureYourWallet.isRecoveryPhraseHidden()).toBe(true)
  })

  async function checkOnWalletPageWithExpectedWalletAndKeys(expectedWalletName: string, expectedWalletKey: string) {
    await viewWallet.checkOnViewWalletPage()
    const walletName = await viewWallet.getWalletName()
    expect(
      await viewWallet.getWalletName(),
      `Expected wallet name to be "${expectedWalletName}, instead it was ${walletName}"`,
      { showPrefix: false }
    ).toBe(expectedWalletName)
    const walletKeys = await viewWallet.getWalletKeys()
    expect(walletKeys).toHaveLength(1)
    expect(walletKeys[0]).toBe(expectedWalletKey)
  }
})
