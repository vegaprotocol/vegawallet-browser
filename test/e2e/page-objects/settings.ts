import { By, WebDriver } from 'selenium-webdriver'
import { clickElement, getByDataTestID, isElementDisplayed } from '../selenium-util'
import { settingsLockButton, settingsPage } from '@frontend/locator-ids'
import { Login } from './login'

export class Settings {
  private readonly lockWalletButton: By = getByDataTestID(settingsLockButton)
  private readonly settingsPageContent: By = getByDataTestID(settingsPage)

  constructor(private readonly driver: WebDriver) {}

  async lockWalletAndCheckLoginPageAppears() {
    clickElement(this.driver, this.lockWalletButton)
    const loginPage = new Login(this.driver)
    expect(await loginPage.isLoginPage(), 'locking the wallet did not lead to the login page being displayed', {}).toBe(
      true
    )
    return loginPage
  }

  async isSettingsPage() {
    return await isElementDisplayed(this.driver, this.settingsPageContent)
  }

  async checkOnSettingsPage() {
    expect(await this.isSettingsPage(), 'expected to be on the settings page but was not', {
      showPrefix: false
    }).toBe(true)
  }
}
