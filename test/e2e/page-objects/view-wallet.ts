import { By, WebDriver } from 'selenium-webdriver'
import {
  clickElement,
  getByDataTestID,
  getElementText,
  waitForElementToBeReady,
  isElementDisplayed,
  waitForChildElementsCount
} from '../selenium-util'
import * as locators from '../../../frontend/locator-ids'
import { locators as walletLocators } from '../../../frontend/routes/auth/wallets'

export class ViewWallet {
  private readonly walletName: By = getByDataTestID(walletLocators.walletsWalletName)
  private readonly createNewKeyPairButton: By = getByDataTestID(walletLocators.walletsCreateKey)
  private readonly walletKeys: By = getByDataTestID('list')
  private readonly networkIndicator: By = getByDataTestID(locators.networkIndicator)
  private readonly copyIcon: By = getByDataTestID('copy-icon')
  private readonly copyableKey: By = getByDataTestID('copy-with-check')

  constructor(private readonly driver: WebDriver) {}

  async getWalletName() {
    return await getElementText(this.driver, this.walletName)
  }

  async getWalletKeys() {
    const keyList = await waitForElementToBeReady(this.driver, this.walletKeys)
    const keyElements = await keyList.findElements(getByDataTestID(walletLocators.walletsKeyName))
    const keys: string[] = []
    for (const key of keyElements) {
      keys.push(await key.getText())
    }
    return keys
  }

  async waitForExpectedNumberOfKeys(expectedNumber: number) {
    const keyList = await waitForElementToBeReady(this.driver, this.walletKeys)
    const keyElements = await keyList.findElements(getByDataTestID(walletLocators.walletsKeyName))
    expect(keyElements.length).toBe(expectedNumber)
  }

  async checkOnViewWalletPage() {
    expect(
      await isElementDisplayed(this.driver, this.createNewKeyPairButton),
      "expected to be on the 'view wallet' page but could not locate the 'view wallets' header ",
      { showPrefix: false }
    ).toBe(true)
  }

  async createNewKeyPair() {
    const keyList = await waitForElementToBeReady(this.driver, this.walletKeys)
    const keyElements = await keyList.findElements(getByDataTestID(walletLocators.walletsKeyName))
    await clickElement(this.driver, this.createNewKeyPairButton)
    await waitForChildElementsCount(this.driver, getByDataTestID(walletLocators.walletsKeyName), keyElements.length + 1)
  }

  async copyPublicKeyToClipboard() {
    await clickElement(this.driver, this.copyIcon)
  }

  async getVisiblePublicKeyText() {
    const publicKey = await getElementText(this.driver, this.copyableKey)
    return publicKey
  }

  async readClipboardChrome() {
    try {
      const clipboardValue = await this.driver.executeScript(() => {
        return navigator.clipboard.readText()
      })
      return clipboardValue
    } catch (error) {
      console.error('Failed to read clipboard:', error)
      return ''
    }
  }

  async getNetworkConnectedTo() {
    return await getElementText(this.driver, this.networkIndicator)
  }
}
