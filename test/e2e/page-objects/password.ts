import { By, WebDriver } from 'selenium-webdriver'
import {
  clickElement,
  getByDataTestID,
  isElementDisplayed,
  sendKeysToElement,
  waitForElementToBeReady
} from '../selenium-util'
import * as locators from '../../../frontend/locator-ids'
import { defaultPassword } from '../wallet-helpers/common'

export class Password {
  private readonly createPasswordBackButton: By = getByDataTestID('create-password-back')
  private readonly passwordInput: By = getByDataTestID(locators.passphraseInput)
  private readonly confirmPasswordInput: By = getByDataTestID(locators.confirmPassphraseInput)
  private readonly acknowledgeWarningCheckbox: By = By.id(locators.passphraseWarningCheckbox)
  private readonly submitButton: By = getByDataTestID(locators.submitPassphraseButton)
  private readonly errorMessage: By = getByDataTestID(locators.errorMessage)

  constructor(private readonly driver: WebDriver) {}

  async goBack() {
    await clickElement(this.driver, this.createPasswordBackButton)
  }

  /**
   * Configures the app credentials for the wallet extension.
   * @param password - The password to set to access the app.
   * @param confirmPassword - The confirmation password to access the app.
   * @param acknowledgeWarning - Whether to acknowledge the warning about password recovery.
   */
  async createPassword(
    password = defaultPassword,
    confirmPassword: string = password,
    acknowledgeWarning: boolean = true
  ) {
    await sendKeysToElement(this.driver, this.passwordInput, password)
    await sendKeysToElement(this.driver, this.confirmPasswordInput, confirmPassword)
    if (acknowledgeWarning) {
      await clickElement(this.driver, this.acknowledgeWarningCheckbox)
      await clickElement(this.driver, this.submitButton)
    }
  }

  async getErrorMessageText() {
    const el = await waitForElementToBeReady(this.driver, this.errorMessage)
    return el.getText()
  }

  async checkOnCreatePasswordPage() {
    expect(
      await isElementDisplayed(this.driver, this.passwordInput),
      "expected to be on the 'password' page but could not locate the password input element",
      { showPrefix: false }
    ).toBe(true)
  }
}
