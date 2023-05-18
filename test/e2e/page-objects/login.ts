import { By, WebDriver } from 'selenium-webdriver'
import { getByDataTestID, isElementDisplayed } from '../selenium-util'
import 'jest-expect-message'
import { loginButton } from '../../../src/locator-ids'

export class Login {
  private readonly loginButton: By = getByDataTestID(loginButton)

  constructor(private readonly driver: WebDriver) {}

  async checkOnLoginPage() {
    expect(this.isLoginPage(), "expected to be on the 'login' page but could not locate the login button", {
      showPrefix: false
    }).toBe(true)
  }

  async isLoginPage() {
    return await isElementDisplayed(this.driver, this.loginButton)
  }
}
