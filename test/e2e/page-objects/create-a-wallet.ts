import { By, WebDriver } from 'selenium-webdriver'
import { clickElement, getByDataTestID, isElementDisplayed } from '../helpers/selenium-util'
import * as locators from '../../../frontend/locator-ids'
import { ImportAWallet } from './import-a-wallet'

export class CreateAWallet {
  private readonly createNewWalletButton: By = getByDataTestID(locators.createNewWalletButton)
  private readonly importWalletButton: By = getByDataTestID(locators.importWalletButton)

  constructor(private readonly driver: WebDriver) {}

  async createNewWallet() {
    await this.checkOnCreateWalletPage()
    await clickElement(this.driver, this.createNewWalletButton)
  }

  async importWallet() {
    await this.checkOnCreateWalletPage()
    await clickElement(this.driver, this.importWalletButton)
    return new ImportAWallet(this.driver)
  }

  async checkOnCreateWalletPage() {
    expect(
      await isElementDisplayed(this.driver, this.createNewWalletButton),
      "expected to be on the 'create wallet' page but could not locate the create wallet button",
      { showPrefix: false }
    ).toBe(true)
  }
}
