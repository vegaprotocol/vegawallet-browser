import { By, WebDriver } from 'selenium-webdriver'
import {
  clickElement,
  getByDataTestID,
  getElementText,
  isElementDisplayed,
  isElementSelected,
  sendKeysToElement,
  waitForElementToBeSelected
} from '../helpers/selenium-util'
import { Login } from './login'
import * as settingsLock from '../../../frontend/routes/auth/settings/lock-section'
import * as radioLocators from '../../../frontend/routes/auth/settings/settings-form-elements/radio'
import * as exportLocators from '../../../frontend/routes/auth/settings/export-recovery-phrase'
import * as exportFormLocators from '../../../frontend/routes/auth/settings/export-recovery-phrase/export-recovery-phrase-form'
import { defaultPassword } from '../helpers/wallet/common-wallet-values'
import locators from '../../../frontend/components/locators'

export class Settings {
  private readonly lockWalletButton: By = getByDataTestID(settingsLock.locators.settingsLockButton)
  private readonly telemetryYes: By = getByDataTestID(`telemetry-${radioLocators.locators.settingsRadioYes}`)
  private readonly telemetryNo: By = getByDataTestID(`telemetry-${radioLocators.locators.settingsRadioNo}`)
  private readonly autoOpenYes: By = getByDataTestID(`autoOpen-${radioLocators.locators.settingsRadioYes}`)
  private readonly autoOpenNo: By = getByDataTestID(`autoOpen-${radioLocators.locators.settingsRadioNo}`)
  private readonly exportRecoveryPhraseTrigger: By = getByDataTestID(
    exportLocators.locators.exportRecoveryPhraseTrigger
  )
  private readonly exportRecoveryPhrasePassphrase: By = getByDataTestID(
    exportFormLocators.locators.exportRecoveryPhraseFormModalPassphrase
  )
  private readonly exportRecoveryPhraseSubmit: By = getByDataTestID(
    exportFormLocators.locators.exportRecoveryPhraseFormModalSubmit
  )
  private readonly exportRecoveryPhraseClose: By = getByDataTestID(
    exportFormLocators.locators.exportRecoveryPhraseFormModalClose
  )
  private readonly passwordErrorText: By = getByDataTestID(locators.errorMessage)
  private readonly recoveryPhraseHidden: By = getByDataTestID(locators.mnemonicContainerHidden)
  private readonly recoveryPhraseRevealed: By = getByDataTestID(locators.mnemonicContainerMnemonic)

  constructor(private readonly driver: WebDriver) {}

  async lockWalletAndCheckLoginPageAppears() {
    clickElement(this.driver, this.lockWalletButton)
    const loginPage = new Login(this.driver)
    expect(await loginPage.isLoginPage(), 'locking the wallet did not lead to the login page being displayed', {}).toBe(
      true
    )
    return loginPage
  }

  async isTelemetrySelected() {
    await this.checkOnSettingsPage()
    const telemetryYesSelected = await isElementSelected(this.driver, this.telemetryYes)
    const telemetryNoSelected = await isElementSelected(this.driver, this.telemetryNo)

    if (telemetryYesSelected) {
      return true
    }
    if (telemetryNoSelected) {
      return false
    }
  }

  async exportRecoveryPhrase(passphrase: string = defaultPassword) {
    await clickElement(this.driver, this.exportRecoveryPhraseTrigger)
    await sendKeysToElement(this.driver, this.exportRecoveryPhrasePassphrase, passphrase)
    await clickElement(this.driver, this.exportRecoveryPhraseSubmit)
  }

  async checkForPasswordError() {
    expect(
      await isElementDisplayed(this.driver, this.passwordErrorText),
      'expected password error text to be found, there was no error'
    ).toBe(true)

    expect(
      await isElementDisplayed(this.driver, this.exportRecoveryPhraseSubmit),
      'expected to still be on the Export Recovery Phrase page after an incorrect password but could not locate the export button'
    )

    return await getElementText(this.driver, this.passwordErrorText)
  }

  async checkRecoveryPhraseExportedAndHidden() {
    expect(
      await isElementDisplayed(this.driver, this.recoveryPhraseHidden),
      'expected the recovery phrase to be available to reveal but could not locate it'
    ).toBe(true)

    expect(
      await isElementDisplayed(this.driver, this.exportRecoveryPhraseClose),
      'expected the close recovery phrase key button to be displayed but it was not'
    ).toBe(true)
  }

  async revealRecoveryPhraseAndGetText(closeView = true) {
    await clickElement(this.driver, this.recoveryPhraseHidden)
    expect(
      await isElementDisplayed(this.driver, this.recoveryPhraseRevealed),
      'expected the recovery phrase to be revealed but it was not'
    ).toBe(true)

    const recoveryPhrase = await getElementText(this.driver, this.recoveryPhraseRevealed)
    if (closeView) {
      await clickElement(this.driver, this.exportRecoveryPhraseClose)
    }

    return recoveryPhrase
  }

  async selectTelemetryYes() {
    await this.checkOnSettingsPage()
    await clickElement(this.driver, this.telemetryYes)
    await waitForElementToBeSelected(this.driver, this.telemetryYes)
  }

  async selectTelemetryNo() {
    await this.checkOnSettingsPage()
    await clickElement(this.driver, this.telemetryNo)
    await waitForElementToBeSelected(this.driver, this.telemetryNo)
  }

  async isAutoOpenSelected() {
    await this.checkOnSettingsPage()
    const autoOpenYesSelected = await isElementSelected(this.driver, this.autoOpenYes)
    const autoOpenNoSelected = await isElementSelected(this.driver, this.autoOpenNo)

    if (autoOpenYesSelected) {
      return true
    }
    if (autoOpenNoSelected) {
      return false
    }
  }

  async selectAutoOpenYes() {
    await this.checkOnSettingsPage()
    await clickElement(this.driver, this.autoOpenYes)
    await waitForElementToBeSelected(this.driver, this.autoOpenYes)
  }

  async selectAutoOpenNo() {
    await this.checkOnSettingsPage()
    await clickElement(this.driver, this.autoOpenNo)
    await waitForElementToBeSelected(this.driver, this.autoOpenNo)
  }

  async isSettingsPage() {
    return await isElementDisplayed(this.driver, this.lockWalletButton)
  }

  async checkOnSettingsPage() {
    expect(await this.isSettingsPage(), 'expected to be on the settings page but was not', {
      showPrefix: false
    }).toBe(true)
  }
}
