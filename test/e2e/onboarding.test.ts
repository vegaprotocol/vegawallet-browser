import { WebDriver } from 'selenium-webdriver'
import { captureScreenshot, initDriver } from './driver'
import { GetStarted } from './page-objects/get-started'
import { Password } from './page-objects/password'
import { SecureYourWallet } from './page-objects/secure-your-wallet'
import { CreateAWallet } from './page-objects/create-a-wallet'
import { ViewWallet } from './page-objects/view-wallet'
import { navigateToLandingPage } from './wallet-helpers/common'
import { APIHelper } from './wallet-helpers/api-helpers'

const recoveryPhrase =
  'solid length discover gun swear nose artwork unfair vacuum canvas push hybrid owner wasp arrest mixed oak miss cage scatter tree harsh critic believe'

const incorrectRecoveryPhrase =
  'solid length discover gun swear nose artwork unfair vacuum canvas push hybrid owner wasp arrest mixed oak miss cage scatter tree harsh critic bob'

describe('Onboarding', () => {
  let driver: WebDriver
  let getStarted: GetStarted
  let password: Password
  let secureYourWallet: SecureYourWallet
  let createAWallet: CreateAWallet
  let viewWallet: ViewWallet
  const testPassword = 'password1'

  beforeEach(async () => {
    driver = await initDriver()
    password = new Password(driver)
    getStarted = new GetStarted(driver)
    secureYourWallet = new SecureYourWallet(driver)
    createAWallet = new CreateAWallet(driver)
    viewWallet = new ViewWallet(driver)
    await navigateToLandingPage(driver)
    await getStarted.getStarted()
  })

  afterEach(async () => {
    await captureScreenshot(driver, expect.getState().currentTestName as string)
    await driver.quit()
  })

  it('can create a new wallet and remember that a wallet has been created when I navigate back to the landing page', async () => {
    // 1101-BWAL-007 I can submit the password I entered
    await password.createPassword(testPassword)
    // 1101-BWAL-009 When I have submitted my new password, I am taken to the next step
    // 1101-BWAL-012 I can choose to create a wallet
    // 1101-BWAL-019 I am given feedback that my wallet was successfully created
    // 1101-BWAL-021 The new Wallet name and key pair are auto generated in the background "Wallet" "Vega Key 1" #
    // 1101-BWAL-022 When I have already created a wallet, I am redirected to the landing page where I can view that wallet

    await createAWallet.createNewWallet()
    await secureYourWallet.revealRecoveryPhrase(true)
    await checkOnWalletPageWithExpectedWalletAndKeys('Wallet 1', 'Key 1')
    await navigateToLandingPage(driver)
    await checkOnWalletPageWithExpectedWalletAndKeys('Wallet 1', 'Key 1')
  })

  it('can successfully import a wallet', async () => {
    // 1101-BWAL-013 I can choose to import an existing wallet
    const apiHelper = new APIHelper(driver)
    await navigateToLandingPage(driver)
    await apiHelper.createPassphraseAndCheckSuccess()
    await navigateToLandingPage(driver)
    const importWallet = await createAWallet.importWallet()
    await importWallet.fillInRecoveryPhraseAndSubmit(recoveryPhrase)
    await viewWallet.checkOnViewWalletPage()
  })

  it('shows an error when recovery phrase is incorrect', async () => {
    //TODO- add ac to specs and update the code here
    // If I submit a recovery phrase I am given feedback if the words are invalid i.e. no wallet found with that recovery phrase (and I can try again)
    const apiHelper = new APIHelper(driver)
    await navigateToLandingPage(driver)
    await apiHelper.createPassphraseAndCheckSuccess()
    await navigateToLandingPage(driver)
    const importWallet = await createAWallet.importWallet()
    await importWallet.fillInRecoveryPhraseAndSubmit(incorrectRecoveryPhrase)
    const errorText = await importWallet.getErrorMessageText()
    expect(errorText).toBeTruthy() //Improve this assertion before merging! Once validation is added.
    await importWallet.fillInRecoveryPhraseAndSubmit(recoveryPhrase)
    await viewWallet.checkOnViewWalletPage()
  })

  it('can navigate back to the getting started page if no password submitted', async () => {
    // 1101-BWAL-001 When I haven't submitted my password, I can go back to the previous step
    await password.createPassword(testPassword, testPassword, false)
    await password.goBack()
    await getStarted.checkOnGetStartedPage()
  })

  it('shows an error message when passwords differ', async () => {
    await password.createPassword(testPassword, testPassword + '2')
    expect(await password.getErrorMessageText()).toBe('Password does not match')
    await password.checkOnCreatePasswordPage()
  })

  it('recovery phrase can be revealed and hidden, cannot continue without revealing and acknowledging warning', async () => {
    // 1101-BWAL-014 - I am provided with a recovery phrase for my new wallet that is initially hidden from view
    // 1101-BWAL-016 - I can choose when to reveal/show the recovery phrase
    // 1101-BWAL-017 - I can copy the recovery phrase into my clipboard
    await password.createPassword(testPassword)
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
