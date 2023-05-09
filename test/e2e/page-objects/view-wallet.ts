import { By, WebDriver } from 'selenium-webdriver'
import { getByDataTestID, getElementText, isElementDisplayed } from '../selenium-util'
import * as locators from '../../../src/locator-ids'
import 'jest-expect-message'

export class ViewWallet {
  private readonly viewWalletsHeader: By = getByDataTestID(locators.viewWalletsHeader)
  private readonly walletName: By = getByDataTestID(locators.walletsWalletName)
  private readonly walletKeys: By = getByDataTestID('list')

  constructor(private readonly driver: WebDriver) {}

  async getWalletName() {
    return await getElementText(this.driver, this.walletName)
  }

  async getWalletKeys() {
    const keyList = await this.driver.findElement(this.walletKeys)
    const keyElements = await keyList.findElements(getByDataTestID(locators.walletsKeyName))
    const keys: string[] = []
    for (const key of keyElements) {
      keys.push(await key.getText())
    }
    return keys
  }

  async isViewWalletsPage() {
    return await isElementDisplayed(this.driver, this.walletName)
  }
}
