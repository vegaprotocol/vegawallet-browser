import { By, WebDriver } from 'selenium-webdriver'
import { locators as popoverLocators } from '../../../frontend/components/modals/popover-open-modal'
import { clickElement, getByDataTestID, isElementDisplayed } from '../helpers/selenium-util'

export class WalletOpenInOtherWindow {
  private readonly continueHereButton: By = getByDataTestID(popoverLocators.continueHere)

  constructor(private readonly driver: WebDriver) {}

  async checkOnWalletOpenInOtherWindowPage() {
    expect(
      await isElementDisplayed(this.driver, this.continueHereButton),
      "expected to be on the 'wallet open in another window' page but could not locate the 'continue here' button",
      {
        showPrefix: false
      }
    ).toBe(true)
  }

  async continueHere() {
    await this.checkOnWalletOpenInOtherWindowPage()
    await clickElement(this.driver, this.continueHereButton)
  }
}
