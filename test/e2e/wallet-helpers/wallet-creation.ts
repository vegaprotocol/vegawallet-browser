import { By, WebDriver } from 'selenium-webdriver'
import {
  clickElement,
  getByDataTestID,
  isElementDisplayed,
  sendKeysToElement,
  waitForElementToBeReady
} from '../selenium-util'
import * as locators from '../../../src/locator-ids'
import 'jest-expect-message'
import componentLocators from '../../../src/components/locators'

export class CreateWallet {
  private readonly landingPageURL: string = 'chrome-extension://jfaancmgehieoohdnmcdfdlkblfcehph/index.html'
  private readonly createNewWalletButton: By = getByDataTestID(locators.createNewWalletButton)
  private readonly getStartedButton: By = getByDataTestID(locators.getStartedButton)
  private readonly passwordInput: By = getByDataTestID(locators.passwordInput)
  private readonly confirmPasswordInput: By = getByDataTestID(locators.confirmPasswordInput)
  private readonly acknowledgeWarningCheckbox: By = By.id(locators.passwordWarningCheckbox)
  private readonly submitButton: By = getByDataTestID(locators.submitPasswordButton)
  private readonly revealRecoveryPhraseButton: By = getByDataTestID(componentLocators.mnemonicContainerHidden)
  private readonly copyRecoveryPhraseToClipboardButton: By = getByDataTestID(componentLocators.copyWithCheck)
  private readonly acknowledgeRecoveryPhraseWarningCheckbox: By = By.id(locators.recoveryPhraseWarningCheckbox)
  private readonly secureWalletContinueButton: By = getByDataTestID(locators.saveMnemonicButton)
  private readonly walletsPage: By = getByDataTestID(locators.walletsPage)
  private readonly errorMessage: By = getByDataTestID(locators.errorMessage)
  private readonly viewWalletsHeader: By = getByDataTestID(locators.viewWalletsHeader)
  checkOnCorrectViewErrorMessage = (expectedPage: string) => `Expected to be on the '${expectedPage}' page but was not`

  /**
   * Constructor for the vega wallet chrome extension CreateWallet workflow.
   * @param driver - The WebDriver instance to use for interacting with the browser.
   */
  constructor(private readonly driver: WebDriver) {}

  /**
   * Navigates to the landing page of the extension and checks if it is the expected page.
   */
  async navigateToLandingPage() {
    await this.driver.get(this.landingPageURL)
    expect(await this.isGetStartedPage(), this.checkOnCorrectViewErrorMessage('Get Started'), {
      showPrefix: false
    }).toBe(true)
  }

  /**
   * Configures the app credentials for the wallet extension.
   * @param password - The password to set to access the app.
   * @param confirmPassword - The confirmation password to access the app.
   * @param acknowledgeWarning - Whether to acknowledge the warning about password recovery.
   */
  async configureAppCredentials(
    password: string,
    confirmPassword: string = password,
    acknowledgeWarning: boolean = true
  ) {
    await clickElement(this.driver, this.getStartedButton)
    await sendKeysToElement(this.driver, this.passwordInput, password)
    await sendKeysToElement(this.driver, this.confirmPasswordInput, confirmPassword)
    if (acknowledgeWarning) {
      await clickElement(this.driver, this.acknowledgeWarningCheckbox)
    }
    await clickElement(this.driver, this.submitButton)
  }

  /**
   * Adds a new wallet.
   * @param acknowledgeWarning - Whether to acknowledge the warning about the recovery phrase.
   */
  async addNewWallet(acknowledgeWarning: boolean = true) {
    expect(await this.isAddWalletPage(), this.checkOnCorrectViewErrorMessage('Create a wallet')).toBe(true)
    await clickElement(this.driver, this.createNewWalletButton)
    expect(await this.isRecoveryPhrasePage(), this.checkOnCorrectViewErrorMessage('Recovery Phrase')).toBe(true)
    await clickElement(this.driver, this.revealRecoveryPhraseButton)
    await clickElement(this.driver, this.copyRecoveryPhraseToClipboardButton)
    if (acknowledgeWarning) {
      await clickElement(this.driver, this.acknowledgeRecoveryPhraseWarningCheckbox)
      await clickElement(this.driver, this.secureWalletContinueButton)
    }
  }

  /**
   * Determines whether the 'Continue' button is enabled on the 'Create Wallet' page.
   * @returns Whether the 'Continue' button is enabled.
   */
  async isContinueFromCreateWalletEnabled() {
    return await this.driver.findElement(this.secureWalletContinueButton).isEnabled()
  }

  /**
   * Determines whether the current page is the recovery phrase page.
   * @returns Whether the current page is the recovery phrase page.
   */
  async isRecoveryPhrasePage() {
    return await isElementDisplayed(this.driver, this.revealRecoveryPhraseButton)
  }

  /**
   * Determines whether the current page is the 'Get Started' page.
   * @returns Whether the current page is the 'Get Started' page.
   */
  async isGetStartedPage() {
    return await isElementDisplayed(this.driver, this.getStartedButton)
  }

  /**
   * Determines whether the current page is the 'Add Wallet' page.
   * @returns Whether the current page is the 'Add Wallet' page.
   */
  async isAddWalletPage() {
    return await isElementDisplayed(this.driver, this.createNewWalletButton)
  }

  /**
   * Determines whether the current page is the create password page.
   * @returns Whether the current page is the create password page.
   */
  async isCreatePasswordPage() {
    return await isElementDisplayed(this.driver, this.passwordInput)
  }

  /**
   * Determines whether the current page is the view wallets page.
   * @returns Whether the current page is the view wallets page.
   */
  async isViewWalletsPage() {
    return await isElementDisplayed(this.driver, this.viewWalletsHeader)
  }

  /**
   * Determines whether the wallet page is displayed.
   * @returns whether the wallet page is displayed.
   */
  async isWalletCreated() {
    return await isElementDisplayed(this.driver, this.walletsPage)
  }

  /**
   * Returns the text from an error message generated when submitting a form with invalid data
   */
  async getErrorMessageText() {
    const el = await waitForElementToBeReady(this.driver, this.errorMessage)
    return el.getText()
  }
}
