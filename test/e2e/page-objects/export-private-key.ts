import { By, WebDriver } from 'selenium-webdriver'
import {
  clickElement,
  getByDataTestID,
  getElementText,
  isElementDisplayed,
  sendKeysToElement
} from '../helpers/selenium-util'
import { defaultPassword } from '../helpers/wallet/common-wallet-values'
import { locators as exportPrivateKeyLocators } from '../../../frontend/routes/auth/wallets/key-details/export-private-key-dialog/export-private-key-form'
import { locators as viewPrivateKeyLocators } from '../../../frontend/routes/auth/wallets/key-details/export-private-key-dialog/view-private-key'
import locators from '../../../frontend/components/locators'

export class ExportPrivateKey {
  private readonly passwordField: By = getByDataTestID(exportPrivateKeyLocators.privateKeyModalPassphrase)
  private readonly exportButton: By = getByDataTestID(exportPrivateKeyLocators.privateKeyModalSubmit)
  private readonly privateKeyHidden: By = getByDataTestID(locators.mnemonicContainerHidden)
  private readonly privateKeyRevealed: By = getByDataTestID(locators.mnemonicContainerMnemonic)
  private readonly viewPrivateKeyClose: By = getByDataTestID(viewPrivateKeyLocators.viewPrivateKeyClose)

  constructor(private readonly driver: WebDriver) {}

  async exportPrivateKey(password: string = defaultPassword) {
    await this.checkOnExportPrivateKeyPage()
    await sendKeysToElement(this.driver, this.passwordField, password)
    await clickElement(this.driver, this.exportButton)
  }

  async checkPrivateKeyExportedandHidden() {
    expect(
      await isElementDisplayed(this.driver, this.privateKeyHidden),
      'expected the private key to be available to reveal but could not locate it'
    ).toBe(true)

    expect(
      await isElementDisplayed(this.driver, this.viewPrivateKeyClose),
      'expected the close private key button to be displayed but it was not'
    ).toBe(false)
  }

  async revealPrivateKeyAndGetText(closeView = true) {
    await clickElement(this.driver, this.privateKeyHidden)
    expect(
      await isElementDisplayed(this.driver, this.privateKeyRevealed),
      'expected the private key to be revealed but it was not'
    ).toBe(true)

    const privateKey = await getElementText(this.driver, this.privateKeyRevealed)
    if (closeView) {
      await clickElement(this.driver, this.viewPrivateKeyClose)
    }

    return privateKey
  }

  async checkOnExportPrivateKeyPage() {
    expect(
      await isElementDisplayed(this.driver, this.exportButton),
      "expected to be on the 'Export private key' page but could not locate the export button",
      { showPrefix: false }
    ).toBe(true)
  }
}
