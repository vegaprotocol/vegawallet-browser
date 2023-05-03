import { WebDriver } from 'selenium-webdriver'
import { CreateWallet } from './wallet-helpers/wallet-creation'
import { initDriver } from './selenium-util'

describe('Onboarding', () => {
  let driver: WebDriver
  let createWallet: CreateWallet
  const testPassword = 'password1'

  beforeAll(async () => {
    driver = await initDriver()
    createWallet = new CreateWallet(driver)
  })

  beforeEach(async () => {
    await createWallet.navigateToLandingPage()
  })

  afterAll(async () => {
    await driver.quit()
  })

  it('can create a new wallet', async () => {
    await createWallet.configureAppCredentials(testPassword)
    await createWallet.addNewWallet()
    expect(await createWallet.isWalletCreated(), 'Expected to be on the create wallet success screen but was not', {
      showPrefix: false
    }).toBe(true)
  })

  it('shows an error message when passwords differ', async () => {
    await createWallet.configureAppCredentials(testPassword, testPassword + '2')
    expect(await createWallet.getErrorMessageText()).toBe('Password does not match')
    expect(
      await createWallet.isCreatePasswordPage(),
      'expected to remain on the password page after failing password validation',
      { showPrefix: false }
    ).toBe(true)
  })

  it('cannot proceed without revealing the revovery phrase', async () => {
    await createWallet.configureAppCredentials(testPassword)
    expect(
      await createWallet.canAttemptContinueFromCreateWallet(),
      'expected to be unable to proceed without revealing the recovery phrase',
      { showPrefix: false }
    ).toBe(false)
  })

  it('shows an error message when recovery phrase warning not acknowledged', async () => {
    await createWallet.configureAppCredentials(testPassword)
    await createWallet.addNewWallet(false)
    expect(await createWallet.getErrorMessageText()).toBe('Please acknowledge the recovery phrase warning to continue')
    expect(
      await createWallet.isAddWalletPage(),
      'expected to remain on the secure wallet page after not acknowledging the recovery phrase warning',
      { showPrefix: false }
    ).toBe(true)
  })
})
