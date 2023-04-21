import { By, WebDriver, until } from 'selenium-webdriver'
import {
  clickElement,
  isElementDisplayed,
  sendKeysToElement,
  waitForElementToBeReady,
} from '../selenium-auto-wait-wrapper'
import * as locators from '../../../src/locator-ids'
import 'jest-expect-message'

/**
 * Represents the Getting Started page of the extension.
 */
export class CreateWallet {
  private readonly landingPageURL: string =
    'chrome-extension://jfaancmgehieoohdnmcdfdlkblfcehph/index.html' // This is assuming the create new wallet is the landing page
  private readonly createNewWalletButton: By = By.id(
    locators.createNewWalletButton
  )
  private readonly passwordInput: By = By.id(locators.passwordInput)
  private readonly confirmPasswordInput: By = By.id(
    locators.confirmPasswordInput
  )
  private readonly acknowledgeWarningCheckbox: By = By.id(
    locators.passwordWarningCheckbox
  )
  private readonly submitButton: By = By.id(locators.submitPasswordButton)
  private readonly revealRecoveryPhraseButton: By = By.id(
    locators.revealRecoveryPhraseButton
  )
  private readonly copyRecoveryPhraseToClipboardButton: By = By.id(
    locators.copyRecoveryPhraseToClipboardButton
  )
  private readonly acknowledgeRecoveryPhraseWarningCheckbox: By = By.id(
    locators.recoveryPhraseWarningCheckbox
  )
  private readonly secureWalletContinueButton: By = By.id(
    locators.secureWalletContinueButton
  )
  private readonly walletCreatedIcon: By = By.id(locators.walletCreatedIcon)
  private readonly errorMessage: By = By.id(locators.errorMessage)
  checkOnCorrectViewErrorMessage = (expectedPage: string) =>
    `Expected to be on the '${expectedPage}' page but was not`

  /**
   * Creates a new instance of the GettingStarted class.
   * @param driver The WebDriver instance to use for interactions with the page.
   */
  constructor(private readonly driver: WebDriver) {}

  /**
   * Navigates to the Getting Started page.
   */
  async navigateToLandingPage() {
    await this.driver.get(this.landingPageURL)
    expect(
      await this.isGettingStartedPage(),
      this.checkOnCorrectViewErrorMessage('Getting Started')
    ).toBe(true)
  }

  /**
   * Clicks the "Create New Wallet" button and fills out the password and confirmation fields and submits
   */
  async configureNewWalletWithPasswords(
    password: string,
    confirmPassword: string = password,
    acknowledgeWarning: boolean = true
  ) {
    await clickElement(this.driver, this.createNewWalletButton)
    await sendKeysToElement(this.driver, this.passwordInput, password)
    await sendKeysToElement(
      this.driver,
      this.confirmPasswordInput,
      confirmPassword
    )
    if (acknowledgeWarning) {
      await clickElement(this.driver, this.acknowledgeWarningCheckbox)
    }
    await clickElement(this.driver, this.submitButton)
  }

  /**
   * Reveals the recovery phrase, copies it to the clipboard, acknowledges the warning and continues
   */
  async secureNewWallet(acknowledgeWarning: boolean = true) {
    expect(
      await this.isSecureWalletPage(),
      this.checkOnCorrectViewErrorMessage('Secure Wallet')
    ).toBe(true)
    await clickElement(this.driver, this.revealRecoveryPhraseButton)
    await clickElement(this.driver, this.copyRecoveryPhraseToClipboardButton)
    if (acknowledgeWarning) {
      await clickElement(
        this.driver,
        this.acknowledgeRecoveryPhraseWarningCheckbox
      )
    }
    await clickElement(
      this.driver,
      this.acknowledgeRecoveryPhraseWarningCheckbox
    )
    await clickElement(this.driver, this.secureWalletContinueButton)
  }

  /**
   * First checks we are on the Secure Wallet page, then returns a boolean indicating if we can attempt proceed
   */
  async canAttemptContinueFromSecureWallet() {
    expect(
      await isElementDisplayed(this.driver, this.revealRecoveryPhraseButton)
    ).toBe(true)
    return await this.driver
      .findElement(this.secureWalletContinueButton)
      .isEnabled()
  }

  /**
   * Returns a boolean indicating if we are on the Secure Wallet page
   */
  async isSecureWalletPage() {
    return await isElementDisplayed(
      this.driver,
      this.revealRecoveryPhraseButton
    )
  }

  /**
   * Returns a boolean indicating if we are on the Getting Started page
   */
  async isGettingStartedPage() {
    return await isElementDisplayed(this.driver, this.createNewWalletButton)
  }

  /**
   * Returns a boolean indicating if we are on the Getting Started page
   */
  async isPasswordPage() {
    return await isElementDisplayed(this.driver, this.passwordInput)
  }

  /**
   * Returns a boolean indicating ig the wallet has been created
   */
  async isWalletCreated() {
    return await isElementDisplayed(this.driver, this.walletCreatedIcon)
  }

  /**
   * Returns the text from an error message generated when submitting a form with invalid data
   */
  async getErrorMessageText() {
    return await waitForElementToBeReady(this.driver, this.errorMessage).then(
      (element) => element.getText()
    )
  }
}
