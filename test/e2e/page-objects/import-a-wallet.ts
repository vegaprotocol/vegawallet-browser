import { By, WebDriver } from 'selenium-webdriver'
import {
  clearTextField,
  clickElement,
  getByDataTestID,
  getElementText,
  isElementDisplayed,
  sendKeysToElement
} from '../helpers/selenium-util'
import { locators } from '../../../frontend/routes/onboarding/import-wallet/wallet-imported'
import { locators as importWalletLocators } from '../../../frontend/routes/onboarding/import-wallet'
import componentLocators from '../../../frontend/components/locators'

export class ImportAWallet {
  private readonly recoveryPhraseField: By = getByDataTestID(importWalletLocators.importMnemonic)
  private readonly errorText: By = getByDataTestID(componentLocators.errorMessage)
  private readonly recoveryPhraseSubmitButton: By = getByDataTestID(importWalletLocators.importMnemonicSubmit)
  private readonly walletImportedSuccess: By = getByDataTestID(locators.walletImported)

  constructor(private readonly driver: WebDriver) {}

  async checkOnImportAWalletPage() {
    expect(
      await this.isImportAWalletPage(),
      "expected to be on the 'Import a wallet' page but could not locate the recovery phrase field",
      {
        showPrefix: false
      }
    ).toBe(true)
  }

  async fillInRecoveryPhraseAndSubmit(recoveryPhrase: string) {
    await clearTextField(this.driver, this.recoveryPhraseField)
    await this.fillInRecoveryPhrase(recoveryPhrase)
    await clickElement(this.driver, this.recoveryPhraseSubmitButton)
  }

  async fillInRecoveryPhrase(recoveryPhrase: string) {
    await this.checkOnImportAWalletPage()
    await sendKeysToElement(this.driver, this.recoveryPhraseField, recoveryPhrase)
  }

  async getErrorMessageText() {
    return await getElementText(this.driver, this.errorText)
  }

  async checkImportWalletSuccessful() {
    expect(
      await isElementDisplayed(this.driver, this.walletImportedSuccess),
      'expected import wallet to be successful but did not locate the success view'
    ).toBe(true)
  }

  async isImportAWalletPage() {
    return await isElementDisplayed(this.driver, this.recoveryPhraseField)
  }
}
