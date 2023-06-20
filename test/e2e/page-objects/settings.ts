import { By, WebDriver } from 'selenium-webdriver'
import { clickElement, getByDataTestID, isElementDisplayed, openLatestWindowHandle, staticWait } from '../selenium-util'
import { Login } from './login'
import { locators } from '../../../frontend/routes/auth/settings'

export class Settings {
  private readonly lockWalletButton: By = getByDataTestID(locators.settingsLockButton)
  private readonly settingsPageContent: By = getByDataTestID(locators.settingsPage)
  private readonly openInNewWindow: By = getByDataTestID(locators.settingsOpenPopoutButton)

  constructor(private readonly driver: WebDriver) {}

  async lockWalletAndCheckLoginPageAppears() {
    clickElement(this.driver, this.lockWalletButton)
    const loginPage = new Login(this.driver)
    expect(await loginPage.isLoginPage(), 'locking the wallet did not lead to the login page being displayed', {}).toBe(
      true
    )
    return loginPage
  }

  async openAppInNewWindowAndSwitchToIt() {
    await this.checkOnSettingsPage()
    const windowHandles = await this.driver.getAllWindowHandles()
    await clickElement(this.driver, this.openInNewWindow)
    await this.driver.wait(async () => {
      return (await this.driver.getAllWindowHandles()).length === windowHandles.length + 1
    }, 10000)
    await openLatestWindowHandle(this.driver)
    return await this.driver.getWindowHandle()
  }

  async isSettingsPage() {
    return await isElementDisplayed(this.driver, this.lockWalletButton)
  }

  async checkOnSettingsPage() {
    expect(await this.isSettingsPage(), 'expected to be on the settings page but was not', {
      showPrefix: false
    }).toBe(true)
  }
}
