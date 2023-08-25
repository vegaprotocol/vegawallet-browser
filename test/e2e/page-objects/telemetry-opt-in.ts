import { By, WebDriver } from 'selenium-webdriver'
import { clickElement, getByDataTestID, isElementDisplayed } from '../helpers/selenium-util'
import { locators } from '../../../frontend/routes/onboarding/telemetry/index'

export class Telemetry {
  private readonly noThanksButton: By = getByDataTestID(locators.noThanks)
  private readonly reportBugsAndCrashesButton: By = getByDataTestID(locators.reportBugsAndCrashes)

  constructor(private readonly driver: WebDriver) {}

  async optIn() {
    await this.checkOnTelemetryPage()
    await clickElement(this.driver, this.reportBugsAndCrashesButton)
  }

  async optOut() {
    await this.checkOnTelemetryPage()
    await clickElement(this.driver, this.noThanksButton)
  }

  async checkOnTelemetryPage() {
    expect(
      await isElementDisplayed(this.driver, this.noThanksButton),
      'expected to be on the Telemetry page but could not locate the password input element',
      { showPrefix: false }
    ).toBe(true)
  }
}
