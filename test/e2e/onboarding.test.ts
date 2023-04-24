import { WebDriver } from 'selenium-webdriver'
import { CreateWallet } from './wallet-helpers/wallet-creation'
import { browser } from 'webextension-polyfill-ts'
import { initDriver } from './selenium-auto-wait-wrapper'
import * as fs from 'fs'
import { promisify } from 'util'

const writeFile = promisify(fs.writeFile)

describe('Onboarding', () => {
  let driver: WebDriver
  let createWallet: CreateWallet
  const testPassword = 'password1'

  beforeEach(async () => {
    driver = initDriver()
    createWallet = new CreateWallet(driver)
    await createWallet.navigateToLandingPage()
  })

  afterEach(async () => {
    browser.storage.local.clear()
    const testName = expect.getState().currentTestName?.replace(/\s+/g, '_')
    const screenshot = await driver.takeScreenshot()
    if (expect.getState().currentTestFailed()) {
      await writeFile(`${testName}.png`, screenshot, 'base64')
    }
  })

  afterAll(async () => {
    await driver.quit()
  })

  it('can create a new wallet', async () => {
    await createWallet.configureAppCredentials(testPassword)
    await createWallet.addNewWallet()
    expect(
      await createWallet.isWalletCreated(),
      'Expected to be on the create wallet success screen but was not'
    ).toBe(true)
  })

  it('shows an error message when passwords differ', async () => {
    await createWallet.configureAppCredentials(testPassword, testPassword + '2')
    expect(await createWallet.getErrorMessageText()).toBe(
      'Please enter identical passwords in both fields'
    )
    expect(
      await createWallet.isPasswordPage(),
      'expected to remain on the password page after failing password validation'
    ).toBe(true)
  })

  it('error shown and cannot proceed without acknowledging password warning', async () => {
    await createWallet.configureAppCredentials(
      testPassword,
      testPassword,
      false
    )
    expect(await createWallet.getErrorMessageText()).toBe(
      'Please acknowledge the password warning to continue'
    )
    expect(
      await createWallet.isPasswordPage(),
      'expected to remain on the password page after not acknowledging the password warning'
    ).toBe(true)
  })

  it('cannot proceed without revealing the revovery phrase', async () => {
    await createWallet.configureAppCredentials(testPassword)
    expect(
      await createWallet.canAttemptContinueFromCreateWallet(),
      'expected to be unable to proceed without revealing the recovery phrase'
    ).toBe(false)
  })

  it('shows an error message when recovery phrase warning not acknowledged', async () => {
    await createWallet.configureAppCredentials(testPassword)
    await createWallet.addNewWallet(false)
    expect(await createWallet.getErrorMessageText()).toBe(
      'Please acknowledge the recovery phrase warning to continue'
    )
    expect(
      await createWallet.isAddWalletPage(),
      'expected to remain on the secure wallet page after not acknowledging the recovery phrase warning'
    ).toBe(true)
  })
})
