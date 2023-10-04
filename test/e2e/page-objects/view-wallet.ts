import { By, WebDriver } from 'selenium-webdriver'
import {
  clickElement,
  getByDataTestID,
  getElementText,
  waitForElementToBeReady,
  isElementDisplayed,
  waitForChildElementsCount
} from '../helpers/selenium-util'
import { locators as keyListLocators } from '../../../frontend/components/key-list'
import { locators as walletPageKeyList } from '../../../frontend/routes/auth/wallets/home/wallets-page-key-list'
import { SignMessage } from './sign-message'
import { locators as vegaKeyLocators } from '../../../frontend/components/keys/vega-key'
import { locators as authPageLocators } from '../../../frontend/components/auth-page'

export class ViewWallet {
  private readonly walletName: By = getByDataTestID(authPageLocators.authPageTitle)
  private readonly createNewKeyPairButton: By = getByDataTestID(walletPageKeyList.walletsCreateKey)
  private readonly walletKeys: By = getByDataTestID('list')
  private readonly copyIcon: By = getByDataTestID('copy-icon')
  private readonly copyableKey: By = getByDataTestID(vegaKeyLocators.explorerLink)
  private readonly signMessageButton: By = getByDataTestID(keyListLocators.walletsSignMessageButton)
  private viewDetailsButton(keyName: string): By {
    return getByDataTestID(keyListLocators.viewDetails(keyName))
  }

  constructor(private readonly driver: WebDriver) {}

  async getWalletName() {
    await this.checkOnViewWalletPage()
    return await getElementText(this.driver, this.walletName)
  }

  async getWalletKeys() {
    await this.checkOnViewWalletPage()
    const keyList = await waitForElementToBeReady(this.driver, this.walletKeys)
    const keyElements = await keyList.findElements(getByDataTestID(vegaKeyLocators.keyName))
    const keys: string[] = []
    for (const key of keyElements) {
      keys.push(await key.getText())
    }
    return keys
  }

  async openSignMessageView() {
    await this.checkOnViewWalletPage()
    await clickElement(this.driver, this.signMessageButton)
    return new SignMessage(this.driver)
  }

  async waitForExpectedNumberOfKeys(expectedNumber: number) {
    await this.checkOnViewWalletPage()
    const keyList = await waitForElementToBeReady(this.driver, this.walletKeys)
    const keyElements = await keyList.findElements(getByDataTestID(vegaKeyLocators.keyName))
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
    await this.checkOnViewWalletPage()
    const keyList = await waitForElementToBeReady(this.driver, this.walletKeys)
    const keyElements = await keyList.findElements(getByDataTestID(vegaKeyLocators.keyName))
    await clickElement(this.driver, this.createNewKeyPairButton)
    await waitForChildElementsCount(this.driver, getByDataTestID(vegaKeyLocators.keyName), keyElements.length + 1)
  }

  async copyPublicKeyToClipboard() {
    await this.checkOnViewWalletPage()
    await clickElement(this.driver, this.copyIcon)
  }

  async openKeyDetails(keyName: string) {
    await this.checkOnViewWalletPage()
    await clickElement(this.driver, this.viewDetailsButton(keyName))
  }

  async getVisiblePublicKeyText() {
    await this.checkOnViewWalletPage()
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
}
