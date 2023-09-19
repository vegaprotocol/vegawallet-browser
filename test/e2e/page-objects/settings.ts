import { By, WebDriver } from 'selenium-webdriver'
import {
  clickElement,
  getByDataTestID,
  isElementDisplayed,
  isElementSelected,
  waitForElementToBeSelected
} from '../helpers/selenium-util'
import { Login } from './login'
import * as settingsLock from '../../../frontend/routes/auth/settings/lock-section'
import * as radioLocators from '../../../frontend/routes/auth/settings/settings-form-elements/radio'

export class Settings {
  private readonly lockWalletButton: By = getByDataTestID(settingsLock.locators.settingsLockButton)
  private readonly telemetryYes: By = getByDataTestID(radioLocators.locators.settingsRadioYes)
  private readonly telemetryNo: By = getByDataTestID(radioLocators.locators.settingsRadioNo)

  constructor(private readonly driver: WebDriver) {}

  async lockWalletAndCheckLoginPageAppears() {
    clickElement(this.driver, this.lockWalletButton)
    const loginPage = new Login(this.driver)
    expect(await loginPage.isLoginPage(), 'locking the wallet did not lead to the login page being displayed', {}).toBe(
      true
    )
    return loginPage
  }

  async isTelemetrySelected() {
    await this.checkOnSettingsPage()
    const telemetryYesSelected = await isElementSelected(this.driver, this.telemetryYes)
    const telemetryNoSelected = await isElementSelected(this.driver, this.telemetryNo)

    if (telemetryYesSelected) {
      return true
    }
    if (telemetryNoSelected) {
      return false
    }
  }

  async selectTelemetryYes() {
    await this.checkOnSettingsPage()
    await clickElement(this.driver, this.telemetryYes)
    await waitForElementToBeSelected(this.driver, this.telemetryYes)
  }

  async selectTelemetryNo() {
    await this.checkOnSettingsPage()
    await clickElement(this.driver, this.telemetryNo)
    await waitForElementToBeSelected(this.driver, this.telemetryNo)
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
