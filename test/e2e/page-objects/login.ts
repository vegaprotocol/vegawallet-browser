import { By, WebDriver } from 'selenium-webdriver'
import {
  clearTextField,
  clickElement,
  getByDataTestID,
  getElementText,
  isElementDisplayed,
  sendKeysToElement
} from '../selenium-util'
import 'jest-expect-message'
import { errorMessage, loginButton, loginPassphrase } from '../../../src/locator-ids'
import { clear } from 'console'

export class Login {
  private readonly loginButton: By = getByDataTestID(loginButton)
  private readonly passwordField: By = getByDataTestID(loginPassphrase)
  private readonly error: By = getByDataTestID(errorMessage)

  constructor(private readonly driver: WebDriver) {}

  async checkOnLoginPage() {
    expect(await this.isLoginPage(), "expected to be on the 'login' page but could not locate the login button", {
      showPrefix: false
    }).toBe(true)
  }

  async getErrorText() {
    return await getElementText(this.driver, this.error)
  }

  async isLoginPage() {
    return await isElementDisplayed(this.driver, this.loginButton)
  }

  async login(password: string) {
    await this.checkOnLoginPage()
    await clearTextField(this.driver, this.passwordField)
    await sendKeysToElement(this.driver, this.passwordField, password)
    await clickElement(this.driver, this.loginButton)
  }
}
