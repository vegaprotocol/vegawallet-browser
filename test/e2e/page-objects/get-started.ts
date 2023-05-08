import { By, WebDriver } from 'selenium-webdriver'
import { clickElement, getByDataTestID, isElementDisplayed } from '../selenium-util'
import * as locators from '../../../src/locator-ids'
import 'jest-expect-message'

export class GetStarted {
  private readonly getStartedButton: By = getByDataTestID(locators.getStartedButton)

  constructor(private readonly driver: WebDriver) {}

  async getStarted() {
    await clickElement(this.driver, this.getStartedButton)
  }

  async isGetStartedPage() {
    return await isElementDisplayed(this.driver, this.getStartedButton)
  }
}
