import { By, WebDriver } from 'selenium-webdriver'
import { clickElement, getByDataTestID, isElementDisplayed } from '../selenium-util'
import * as locators from '../../../src/locator-ids'
import 'jest-expect-message'

export class CreateAWallet {
  private readonly createNewWalletButton: By = getByDataTestID(locators.createNewWalletButton)

  constructor(private readonly driver: WebDriver) {}

  async createNewWallet() {
    await clickElement(this.driver, this.createNewWalletButton)
  }

  async isCreateWalletPage() {
    return await isElementDisplayed(this.driver, this.createNewWalletButton)
  }
}
