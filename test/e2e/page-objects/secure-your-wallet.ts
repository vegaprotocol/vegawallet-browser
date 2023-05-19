import { By, WebDriver } from 'selenium-webdriver'
import { clickElement, getByDataTestID, isElementDisplayed, isElementEnabled } from '../selenium-util'
import * as locators from '../../../src/locator-ids'
import 'jest-expect-message'
import componentLocators from '../../../src/components/locators'

export class SecureYourWallet {
  private readonly revealRecoveryPhraseButton: By = getByDataTestID(componentLocators.mnemonicContainerHidden)
  private readonly hideRecoveryPhraseButton: By = getByDataTestID(componentLocators.hideIcon)
  private readonly recoveryPhraseElement: By = getByDataTestID(componentLocators.mnemonicContainerShown)
  private readonly secureYourWalletPage: By = getByDataTestID(locators.secureYourWalletPage)
  private readonly copyRecoveryPhraseToClipboardButton: By = getByDataTestID(componentLocators.copyWithCheck)
  private readonly acknowledgeRecoveryPhraseWarningCheckbox: By = By.id(locators.recoveryPhraseWarningCheckbox)
  private readonly secureWalletContinueButton: By = getByDataTestID(locators.saveMnemonicButton)

  constructor(private readonly driver: WebDriver) {}

  async revealRecoveryPhrase(acknwledgeWarningAndContinue: boolean = false) {
    await clickElement(this.driver, this.revealRecoveryPhraseButton)
    await clickElement(this.driver, this.copyRecoveryPhraseToClipboardButton)
    if (acknwledgeWarningAndContinue) {
      await this.acceptRecoveryPhraseWarning()
    }
  }

  async acceptRecoveryPhraseWarning() {
    await clickElement(this.driver, this.acknowledgeRecoveryPhraseWarningCheckbox)
    await clickElement(this.driver, this.secureWalletContinueButton)
  }

  async hideRecoveryPhrase() {
    await clickElement(this.driver, this.hideRecoveryPhraseButton)
  }

  async isRecoveryPhraseDisplayed() {
    return await isElementDisplayed(this.driver, this.recoveryPhraseElement)
  }

  async isRecoveryPhraseHidden() {
    try {
      return !(await this.driver.findElement(this.recoveryPhraseElement))
    } catch (error) {
      if ((error as Error).name === 'NoSuchElementError') {
        return true
      }
      throw error
    }
  }

  async isContinueEnabled() {
    return await isElementEnabled(this.driver, this.secureWalletContinueButton)
  }

  async checkOnSecureYourWalletPage() {
    expect(
      await isElementDisplayed(this.driver, this.secureYourWalletPage),
      "expected to be on the 'secure your wallet' page but could not locate the 'secure your wallet' header ",
      { showPrefix: false }
    ).toBe(true)
  }
}
