import { By, WebDriver } from 'selenium-webdriver'
import { clickElement, getByDataTestID, getElementText, waitForElementToBeReady } from '../selenium-util'
import * as locators from '../../../src/locator-ids'
import 'jest-expect-message'
import CopyToClipboard from 'react-copy-to-clipboard'

export class ViewWallet {
  private readonly viewWalletsHeader: By = getByDataTestID(locators.viewWalletsHeader)
  private readonly walletName: By = getByDataTestID(locators.walletsWalletName)
  private readonly createNewKeyPairButton: By = getByDataTestID(locators.walletsCreateKey)
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
    const keyElements = await keyList.findElements(getByDataTestID(locators.walletsKeyName))
    const keys: string[] = []
    for (const key of keyElements) {
      keys.push(await key.getText())
    }
    return keys
  }

  async checkOnViewWalletsPage() {
    const walletHeaderText = await getElementText(this.driver, this.walletName)
    expect(
      walletHeaderText,
      `Expected the name of the wallet to be on display as 'Wallet 1', instead it was ${walletHeaderText}`
    ).toBe('Wallet 1')
  }

  async createNewKeyPair() {
    await clickElement(this.driver, this.createNewKeyPairButton)
  }

  async copyPublicKeyToClipboard() {
    await clickElement(this.driver, this.copyIcon)
  }

  async getVisiblePublicKeyText() {
    const publicKey = await getElementText(this.driver, this.copyableKey)
    return publicKey
  }

  async readClipboard() {
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
