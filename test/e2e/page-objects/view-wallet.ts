import { By, WebDriver } from 'selenium-webdriver'
import {
  clickElement,
  getByDataTestID,
  getElementText,
  isElementDisplayed,
  waitForElementToBeReady
} from '../selenium-util'
import * as locators from '../../../src/locator-ids'
import 'jest-expect-message'

export class ViewWallet {
  private readonly viewWalletsHeader: By = getByDataTestID(locators.viewWalletsHeader)
  private readonly walletName: By = getByDataTestID(locators.walletsWalletName)
  private readonly createNewKeyPairButton: By = getByDataTestID(locators.walletsCreateKey)
  private readonly walletKeys: By = getByDataTestID('list')
  private readonly networkIndicator: By = getByDataTestID(locators.networkIndicator)

  constructor(private readonly driver: WebDriver) {}

  async getWalletName() {
    return await getElementText(this.driver, this.walletName)
  }

  async getWalletKeys() {
    const keyList = await waitForElementToBeReady(this.driver, this.walletKeys)
    const keyElements = await keyList.findElements(getByDataTestID(locators.walletsKeyName))
    const keys: string[] = []
    for (const key of keyElements) {
      keys.push(await key.getText())
    }
    return keys
  }

  async checkOnViewWalletPage() {
    expect(
      await isElementDisplayed(this.driver, this.walletName),
      "expected to be on the 'view wallet' page but could not locate the 'view wallets' header ",
      { showPrefix: false }
    ).toBe(true)
  }

  async createNewKeyPair() {
    await clickElement(this.driver, this.createNewKeyPairButton)
  }

  async getNetworkConnectedTo() {
    return await getElementText(this.driver, this.networkIndicator)
  }
}
