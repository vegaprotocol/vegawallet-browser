import { By, WebDriver } from 'selenium-webdriver'
import { clickElement, getByDataTestID, isElementDisplayed, sendKeysToElement } from '../selenium-util'
import 'jest-expect-message'
import { loginButton, loginPassphrase } from '../../../src/locator-ids'

export class Login {
  private readonly loginButton: By = getByDataTestID(loginButton)
  private readonly passwordField: By = getByDataTestID(loginPassphrase)

  constructor(private readonly driver: WebDriver) {}

  async checkOnLoginPage() {
    expect(await this.isLoginPage(), "expected to be on the 'login' page but could not locate the login button", {
      showPrefix: false
    }).toBe(true)
  }

  async isLoginPage() {
    return await isElementDisplayed(this.driver, this.loginButton)
  }

  async login(password: string) {
    await this.checkOnLoginPage()
    await sendKeysToElement(this.driver, this.passwordField, password)
    await clickElement(this.driver, this.loginButton)
  }
}
