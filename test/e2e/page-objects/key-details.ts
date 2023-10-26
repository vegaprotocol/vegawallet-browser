import { By, WebDriver } from 'selenium-webdriver'
import {
  clickElement,
  getAttributeValue,
  getByDataTestID,
  getElementText,
  isElementDisplayed,
  sendKeysToElement
} from '../helpers/selenium-util'
import { locators as keyListLocators } from '../../../frontend/components/key-list'
import { locators as vegaKeyLocators } from '../../../frontend/components/keys/vega-key'
import { locators as keyDropdownLocators } from '../../../frontend/routes/auth/wallets/key-details/key-selector'
import { locators as renameKeyLocators } from '../../../frontend/routes/auth/wallets/key-details/rename-key-dialog/rename-key-dialog'
import { locators as renameKeyFormLocators } from '../../../frontend/routes/auth/wallets/key-details/rename-key-dialog/rename-key-form'
import { locators as assetCardLocators } from '../../../frontend/routes/auth/wallets/key-details/assets-list/asset-card'
import { locators as exportPrivateKeyLocators } from '../../../frontend/routes/auth/wallets/key-details/export-private-key-dialog/export-private-key-dialog'

import generalLocators from '../../../frontend/components/locators'

export class KeyDetails {
  private readonly keysDropdownMenu: By = getByDataTestID(keyDropdownLocators.keySelectorTrigger)
  private readonly assetBalance: By = getByDataTestID(assetCardLocators.assetHeaderTotal)
  private readonly exportPrivateKey: By = getByDataTestID(exportPrivateKeyLocators.privateKeyTrigger)
  private readonly renameKeyButton: By = getByDataTestID(renameKeyLocators.renameKeyTrigger)
  private readonly renameKeyField: By = getByDataTestID(renameKeyFormLocators.renameKeyInput)
  private readonly submitNewKeyNameButton: By = getByDataTestID(renameKeyFormLocators.renameKeySubmit)
  private readonly expandAssetBalanceDetails: By = getByDataTestID(generalLocators.dropdownArrow)
  private readonly explorerLink: By = getByDataTestID(vegaKeyLocators.explorerLink)
  private readonly notification: By = getByDataTestID('notification')
  private viewDetailsButton(keyName: string): By {
    return getByDataTestID(keyListLocators.viewDetails(keyName))
  }
  private keyDropdownItem(keyName: string): By {
    return getByDataTestID(keyListLocators.viewDetails(keyName))
  }
  private currentSelectedKey(keyName: string): By {
    return getByDataTestID(keyDropdownLocators.keySelectedCurrentKey(keyName))
  }

  constructor(private readonly driver: WebDriver) {}

  async openKeyDetails(keyName: string) {
    await clickElement(this.driver, this.viewDetailsButton(keyName))
  }

  async openExportPrivateKeyDialog() {
    await this.checkOnExpectedKeyDetails()
    await clickElement(this.driver, this.exportPrivateKey)
  }

  async getVegaExplorerLink() {
    return await getAttributeValue(this.driver, this.explorerLink, 'href')
  }

  async isNotificationDisplayed(timeout = 5000) {
    await this.checkOnExpectedKeyDetails()
    return await isElementDisplayed(this.driver, this.notification, timeout)
  }

  async getNotificationText() {
    expect(await this.isNotificationDisplayed(), 'expected notification to be displayed but it was not').toBe(true)
    return await getElementText(this.driver, this.notification)
  }

  async getAssetBalance() {
    await clickElement(this.driver, this.expandAssetBalanceDetails)
    return await getElementText(this.driver, this.assetBalance)
  }

  async selectKeyFromDropdownAndConfirmNewKeySelected(keyName: string) {
    await clickElement(this.driver, this.keysDropdownMenu)
    await clickElement(this.driver, this.keyDropdownItem(keyName))
    await this.checkExpectedKeySelected(keyName)
  }

  async checkExpectedKeySelected(expectedKeyName: string) {
    expect(
      await isElementDisplayed(this.driver, this.currentSelectedKey(expectedKeyName)),
      `expected ${expectedKeyName} to be the selected 
    dropdown item but could not locate the corresponding currently selected element`
    ).toBe(true)
  }

  async renameKey(newKeyName: string) {
    await clickElement(this.driver, this.renameKeyButton)
    await sendKeysToElement(this.driver, this.renameKeyField, newKeyName)
    await clickElement(this.driver, this.submitNewKeyNameButton)
  }

  async checkOnExpectedKeyDetails() {
    expect(
      await isElementDisplayed(this.driver, this.keysDropdownMenu),
      'expected to be able to locate the keys dropdown menu but could not'
    ).toBe(true)
  }
}
