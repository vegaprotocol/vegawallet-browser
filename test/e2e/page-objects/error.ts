import { By, WebDriver } from 'selenium-webdriver'
import { clickElement, getByDataTestID, isElementDisplayed } from '../selenium-util'
import { locators } from '../../../frontend/components/error-modal'

export class ErrorModal {
  private readonly errorPage: By = getByDataTestID(locators.errorModal)
  private readonly closeErrorModal: By = getByDataTestID(locators.errorModalClose)

  constructor(private readonly driver: WebDriver) {}

  async clickCloseButton() {
    await clickElement(this.driver, this.closeErrorModal)
  }

  async checkOnErrorPage() {
    expect(
      await isElementDisplayed(this.driver, this.errorPage),
      "expected to be on the connect wallet page but couldn't find the approve button",
      { showPrefix: false }
    ).toBe(true)
  }
}
