import { By, WebDriver } from 'selenium-webdriver'
import {
  clickElement,
  getByDataTestID,
  getElementText,
  isElementDisplayed,
  isElementEnabled
} from '../helpers/selenium-util'
import componentLocators from '../../../frontend/components/locators'
import { locators as baseLocators } from '../../../frontend/components/pages/page'
import * as walletCreated from '../../../frontend/routes/onboarding/save-mnemonic/wallet-created'
import { locators as mnemonicForm } from '../../../frontend/routes/onboarding/save-mnemonic/save-mnemonic-form'

const recoveryPhraseWarningCheckbox = 'acceptedTerms' // by id
const secureYourWalletPage = 'secure-your-wallet'

export class SecureYourWallet {
  private readonly revealRecoveryPhraseButton: By = getByDataTestID(componentLocators.mnemonicContainerHidden)
  private readonly hideRecoveryPhraseButton: By = getByDataTestID(componentLocators.hideIcon)
  private readonly recoveryPhraseElement: By = getByDataTestID(componentLocators.mnemonicContainerShown)
  private readonly recoveryPhraseText: By = getByDataTestID(componentLocators.mnemonicContainerMnemonic)
  private readonly secureYourWalletPage: By = getByDataTestID(secureYourWalletPage)
  private readonly copyRecoveryPhraseToClipboardButton: By = getByDataTestID(componentLocators.copyWithCheck)
  private readonly acknowledgeRecoveryPhraseWarningCheckbox: By = By.id(recoveryPhraseWarningCheckbox)
  private readonly secureWalletContinueButton: By = getByDataTestID(mnemonicForm.saveMnemonicButton)
  private readonly walletCreatedIcon: By = getByDataTestID(walletCreated.locators.walletCreated)
  private readonly backButton: By = getByDataTestID(baseLocators.basePageBack)

  constructor(private readonly driver: WebDriver) {}

  async revealRecoveryPhrase(acknwledgeWarningAndContinue: boolean = false) {
    await clickElement(this.driver, this.revealRecoveryPhraseButton)
    await clickElement(this.driver, this.copyRecoveryPhraseToClipboardButton)
    if (acknwledgeWarningAndContinue) {
      await this.acceptRecoveryPhraseWarning()
    }
  }

  async getRecoveryPhraseText() {
    expect(
      await this.isRecoveryPhraseDisplayed(),
      'expected recovery phrase to be displayed prior to getting the text'
    ).toBe(true)
    return await getElementText(this.driver, this.recoveryPhraseText)
  }

  async acceptRecoveryPhraseWarning() {
    await clickElement(this.driver, this.acknowledgeRecoveryPhraseWarningCheckbox)
    await clickElement(this.driver, this.secureWalletContinueButton)
  }

  async goBack() {
    await clickElement(this.driver, this.backButton)
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

  async checkCreateWalletSuccessful() {
    expect(
      await isElementDisplayed(this.driver, this.walletCreatedIcon),
      'expected wallet to be created but could not locate the success icon'
    ).toBe(true)
  }

  async checkOnSecureYourWalletPage() {
    expect(
      await isElementDisplayed(this.driver, this.secureYourWalletPage),
      "expected to be on the 'secure your wallet' page but could not locate the 'secure your wallet' header ",
      { showPrefix: false }
    ).toBe(true)
  }
}
