import { WebDriver } from 'selenium-webdriver'
import { CreateWallet } from './wallet-helpers/wallet-creation'
import { initDriver } from './selenium-util'
import { writeFileSync } from 'fs';

describe('Onboarding', () => {
  let driver: WebDriver
  let createWallet: CreateWallet
  const testPassword = 'password1'

  beforeEach(async () => {
    driver = await initDriver()
    createWallet = new CreateWallet(driver)
    await createWallet.navigateToLandingPage()
  })

  afterEach(async () => {
  
   
      // take a screenshot and save it to a file
      const screenshot = await driver.takeScreenshot()
      writeFileSync('screenshot.png', screenshot, 'base64')
      console.log('Screenshot saved to screenshot.png')
    
    await driver.quit()
  })

  it('can create a new wallet', async () => {
    // 1101-BWAL-007 I can submit the password I entered
    // 1101-BWAL-008 When I have submitted my new password, I am given some feedback that it was set successfully
    // 1101-BWAL-009 When I have submitted my new password, I am taken to the next step

    await createWallet.configureAppCredentials(testPassword)
    // assert a success message here
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

  it('cannot proceed without revealing the recovery phrase', async () => {
    await createWallet.configureAppCredentials(testPassword)
    await createWallet.addNewWallet(false, false)
    expect(
      await createWallet.isContinueFromCreateWalletEnabled(),
      'expected to be unable to proceed without revealing the recovery phrase',
      { showPrefix: false }
    ).toBe(false)
  })

  it('button disabled when recovery phrase warning not acknowledged', async () => {
    await createWallet.configureAppCredentials(testPassword)
    await createWallet.addNewWallet(false)
    expect(await createWallet.isContinueFromCreateWalletEnabled()).toBe(false)
    expect(
      await createWallet.isRecoveryPhrasePage(),
      'expected to remain on the secure wallet page after not acknowledging the recovery phrase warning',
      { showPrefix: false }
    ).toBe(true)
  })
})
