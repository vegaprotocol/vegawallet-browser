import { By, WebDriver } from 'selenium-webdriver'
import { clickElement, getByDataTestID, isElementDisplayed } from '../selenium-util'
import * as locators from '@frontend/locator-ids'
import { Password } from './password'

export class GetStarted {
  private readonly getStartedButton: By = getByDataTestID(locators.getStartedButton)

  constructor(private readonly driver: WebDriver) {}

  async getStarted() {
    await clickElement(this.driver, this.getStartedButton)
    const passwordPage = new Password(this.driver)
    await passwordPage.checkOnCreatePasswordPage()
    return passwordPage
  }

  async checkOnGetStartedPage() {
    expect(
      await isElementDisplayed(this.driver, this.getStartedButton),
      "expected to be on the 'get started' page but could not locate the get started button",
      { showPrefix: false }
    ).toBe(true)
  }
}
