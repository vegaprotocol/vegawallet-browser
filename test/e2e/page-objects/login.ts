import { By, WebDriver } from 'selenium-webdriver'
import {
  clearTextField,
  clickElement,
  getByDataTestID,
  getElementText,
  isElementDisplayed,
  sendKeysToElement
} from '../helpers/selenium-util'
import { defaultPassword } from '../helpers/wallet/common-wallet-values'
import { locators } from '../../../frontend/routes/login'
import componentLocators from '../../../frontend/components/locators'

export class Login {
  private readonly loginButton: By = getByDataTestID(locators.loginButton)
  private readonly passwordField: By = getByDataTestID(locators.loginPassphrase)
  private readonly error: By = getByDataTestID(componentLocators.errorMessage)

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

  async login(password = defaultPassword) {
    await this.checkOnLoginPage()
    await clearTextField(this.driver, this.passwordField)
    await sendKeysToElement(this.driver, this.passwordField, password)
    await clickElement(this.driver, this.loginButton)
  }
}
