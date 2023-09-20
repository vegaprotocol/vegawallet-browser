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
  private readonly telemetryYes: By = getByDataTestID(`telemetry-${radioLocators.locators.settingsRadioYes}`)
  private readonly telemetryNo: By = getByDataTestID(`telemetry-${radioLocators.locators.settingsRadioNo}`)
  private readonly autoOpenYes: By = getByDataTestID(`autoOpen-${radioLocators.locators.settingsRadioYes}`)
  private readonly autoOpenNo: By = getByDataTestID(`autoOpen-${radioLocators.locators.settingsRadioNo}`)

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

  async isAutoOpenSelected() {
    await this.checkOnSettingsPage()
    const autoOpenYesSelected = await isElementSelected(this.driver, this.autoOpenYes)
    const autoOpenNoSelected = await isElementSelected(this.driver, this.autoOpenNo)

    if (autoOpenYesSelected) {
      return true
    }
    if (autoOpenNoSelected) {
      return false
    }
  }

  async selectAutoOpenYes() {
    await this.checkOnSettingsPage()
    await clickElement(this.driver, this.autoOpenYes)
    await waitForElementToBeSelected(this.driver, this.autoOpenYes)
  }

  async selectAutoOpenNo() {
    await this.checkOnSettingsPage()
    await clickElement(this.driver, this.autoOpenNo)
    await waitForElementToBeSelected(this.driver, this.autoOpenNo)
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
