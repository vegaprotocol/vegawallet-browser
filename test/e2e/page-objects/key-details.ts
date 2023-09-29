import { By, WebDriver } from 'selenium-webdriver'
import { clickElement, getByDataTestID, getElementText, isElementDisplayed } from '../helpers/selenium-util'
import { locators as keyListLocators } from '../../../frontend/routes/auth/wallets/home/key-list'
import { locators as keyDropdownLocators } from '../../../frontend/routes/auth/wallets/key-details/key-selector'
import { locators as assetCardLocators } from '../../../frontend/routes/auth/wallets/key-details/asset-card'

import { locators as vegaKeyLocators } from '../../../frontend/components/keys/vega-key'
import generalLocators from '../../../frontend/components/locators'

export class KeyDetails {
  private readonly copyIcon: By = getByDataTestID('copy-icon')
  private readonly copyableKey: By = getByDataTestID(vegaKeyLocators.explorerLink)
  private readonly signMessageButton: By = getByDataTestID(keyListLocators.walletsSignMessageButton)
  private readonly keysDropdownMenu: By = getByDataTestID(keyDropdownLocators.keySelectorTrigger)
  private readonly keyName: By = getByDataTestID(vegaKeyLocators.keyName)
  private readonly assetBalance: By = getByDataTestID(assetCardLocators.assetHeaderTotal)
  private readonly expandAssetBalanceDetails: By = getByDataTestID(generalLocators.dropdownArrow)
  private viewDetailsButton(keyName: string): By {
    return getByDataTestID(keyListLocators.viewDetails(keyName))
  }
  private keyDropdownItem(keyName: string): By {
    return getByDataTestID(keyDropdownLocators.keySelectedDropdownItem(keyName))
  }
  private currentSelectedKey(keyName: string): By {
    return getByDataTestID(keyDropdownLocators.keySelectedCurrentKey(keyName))
  }

  constructor(private readonly driver: WebDriver) {}

  async openKeyDetails(keyName: string) {
    await clickElement(this.driver, this.viewDetailsButton(keyName))
  }

  async getAssetBalance() {
    await clickElement(this.driver, this.expandAssetBalanceDetails)
    return await getElementText(this.driver, this.assetBalance)
  }

  async selectKeyFromDropdownAndConfirmNewKeySelected(keyName: string) {
    await clickElement(this.driver, this.keysDropdownMenu)
    await clickElement(this.driver, this.keyDropdownItem(keyName))
    expect(
      await isElementDisplayed(this.driver, this.currentSelectedKey(keyName)),
      `expected ${keyName} to be the selected 
    dropdown item but could not locate the corresponding currently selected element`
    ).toBe(true)
  }

  async checkOnExpectedKeyDetails() {
    expect(
      await isElementDisplayed(this.driver, this.keysDropdownMenu),
      'expected to be able to locate the keys dropdown menu but could not'
    ).toBe(true)
  }

  async getVisiblePublicKeyText() {
    const publicKey = await getElementText(this.driver, this.copyableKey)
    return publicKey
  }
}
