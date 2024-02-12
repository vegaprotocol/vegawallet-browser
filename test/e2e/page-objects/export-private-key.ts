import { By, WebDriver } from 'selenium-webdriver'
import {
  clickElement,
  getByDataTestID,
  getElementText,
  isElementDisplayed,
  sendKeysToElement
} from '../helpers/selenium-util'
import { defaultPassword } from '../helpers/wallet/common-wallet-values'
import { locators as viewPrivateKeyLocators } from '../../../frontend/routes/auth/wallets/key-details/export-private-key-dialog/view-private-key'
import locators from '../../../frontend/components/locators'
import { locators as passwordFormLocators } from '../../../frontend/components/password-form'

export class ExportPrivateKey {
  private readonly passwordField: By = getByDataTestID(passwordFormLocators.passphraseInput])
  private readonly exportButton: By = getByDataTestID(passwordFormLocators.passphraseSubmit)
  private readonly privateKeyHidden: By = getByDataTestID(locators.mnemonicContainerHidden)
  private readonly privateKeyRevealed: By = getByDataTestID(locators.mnemonicContainerMnemonic)
  private readonly viewPrivateKeyClose: By = getByDataTestID(viewPrivateKeyLocators.viewPrivateKeyClose)
  private readonly passwordErrorText: By = getByDataTestID(locators.errorMessage)

  constructor(private readonly driver: WebDriver) {}

  async exportPrivateKey(password: string = defaultPassword) {
    await this.checkOnExportPrivateKeyPage()
    await sendKeysToElement(this.driver, this.passwordField, password)
    await clickElement(this.driver, this.exportButton)
  }

  async checkPrivateKeyExportedAndHidden() {
    expect(
      await isElementDisplayed(this.driver, this.privateKeyHidden),
      'expected the private key to be available to reveal but could not locate it'
    ).toBe(true)

    expect(
      await isElementDisplayed(this.driver, this.viewPrivateKeyClose),
      'expected the close private key button to be displayed but it was not'
    ).toBe(true)
  }

  async checkForPasswordError() {
    expect(
      await isElementDisplayed(this.driver, this.passwordErrorText),
      'expected password error text to be found, there was no error'
    ).toBe(true)

    expect(
      await isElementDisplayed(this.driver, this.exportButton),
      'expected to still be on the Export Private Key page after an incorrect password but could not locate the export button'
    )

    return await getElementText(this.driver, this.passwordErrorText)
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
