import { WebDriver } from 'selenium-webdriver'
import { initDriver } from './driver'
import { GetStarted } from './page-objects/get-started'
import { Password } from './page-objects/password'
import { SecureYourWallet } from './page-objects/secure-your-wallet'
import { CreateAWallet } from './page-objects/create-a-wallet'
import { ViewWallet } from './page-objects/view-wallet'
import { navigateToLandingPage } from './wallet-helpers/common'

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
    await driver.quit()
  })

  it('can create a new wallet and remember that a wallet has been created when I navigate back to the landing page', async () => {
    // 1101-BWAL-007 I can submit the password I entered
    await password.createPassword(testPassword)
    // 1101-BWAL-009 When I have submitted my new password, I am taken to the next step
    // 1101-BWAL-011 I can choose to create a wallet
    // 1101-BWAL-020 The new Wallet name and key pair are auto generated in the background "Wallet" "Vega Key 1" #
    // 1101-BWAL-021 When I have already created a wallet, I am redirected to the landing page where I can view that wallet
    await createAWallet.createNewWallet()
    await secureYourWallet.revealRecoveryPhrase(true)
    await checkOnWalletPageWithExpectedWalletAndKeys('Wallet 1', 'Key 1')
    await navigateToLandingPage(driver)
    await checkOnWalletPageWithExpectedWalletAndKeys('Wallet 1', 'Key 1')
  })

  it('can navigate back to the getting started page if no password submitted', async () => {
    // 1101-BWAL-001 When I haven't submitted my password, I can go back to the previous step
    await password.createPassword(testPassword, testPassword, false)
    await password.goBack()
    expect(await getStarted.isGetStartedPage(), 'expected to be able to navigate back to the Get Started', {
      showPrefix: false
    }).toBe(true)
  })

  it('shows an error message when passwords differ', async () => {
    await password.createPassword(testPassword, testPassword + '2')
    expect(await password.getErrorMessageText()).toBe('Password does not match')
    expect(
      await password.isCreatePasswordPage(),
      'expected to remain on the password page after failing password validation',
      { showPrefix: false }
    ).toBe(true)
  })

  it('recovery phrase can be revealed and hidden, cannot continue without revealing and acknowledging warning', async () => {
    // 1101-BWAL-013 - I am provided with a recovery phrase for my new wallet that is initially hidden from view
    // 1101-BWAL-015 - I can choose when to reveal/show the recovery phrase
    // 1101-BWAL-016 - I can copy the recovery phrase into my clipboard
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
    expect(await viewWallet.isViewWalletsPage(), 'Expected to be on the create wallet page but was not', {
      showPrefix: false
    }).toBe(true)
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
