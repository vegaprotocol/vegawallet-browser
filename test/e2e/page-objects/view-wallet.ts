import { By, WebDriver } from 'selenium-webdriver'
import {
  clickElement,
  getByDataTestID,
  getElementText,
  waitForElementToBeReady,
  isElementDisplayed,
  waitForChildElementsCount
} from '../selenium-util'
import { locators as walletLocators } from '../../../frontend/routes/auth/wallets'
import { locators as keyListLocators } from '../../../frontend/routes/auth/wallets/key-list'
import { SignMessage } from './sign-message'

export class ViewWallet {
  private readonly walletName: By = getByDataTestID(walletLocators.walletsWalletName)
  private readonly createNewKeyPairButton: By = getByDataTestID(keyListLocators.walletsCreateKey)
  private readonly walletKeys: By = getByDataTestID('list')
  private readonly copyIcon: By = getByDataTestID('copy-icon')
  private readonly copyableKey: By = getByDataTestID(keyListLocators.walletsExplorerLink)
  private readonly signMessageButton: By = getByDataTestID(keyListLocators.walletsSignMessageButton)

  constructor(private readonly driver: WebDriver) {}

  async getWalletName() {
    await this.checkOnViewWalletPage()
    return await getElementText(this.driver, this.walletName)
  }

  async getWalletKeys() {
    await this.checkOnViewWalletPage()
    const keyList = await waitForElementToBeReady(this.driver, this.walletKeys)
    const keyElements = await keyList.findElements(getByDataTestID(keyListLocators.walletsKeyName))
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
    const keyElements = await keyList.findElements(getByDataTestID(keyListLocators.walletsKeyName))
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
    const keyElements = await keyList.findElements(getByDataTestID(keyListLocators.walletsKeyName))
    await clickElement(this.driver, this.createNewKeyPairButton)
    await waitForChildElementsCount(
      this.driver,
      getByDataTestID(keyListLocators.walletsKeyName),
      keyElements.length + 1
    )
  }

  async copyPublicKeyToClipboard() {
    await this.checkOnViewWalletPage()
    await clickElement(this.driver, this.copyIcon)
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
