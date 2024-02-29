import { By, WebDriver } from 'selenium-webdriver'
import { clickElement, getByDataTestID } from '../helpers/selenium-util'
import { locators as warningLocators } from '../../../frontend/routes/auth/settings/home/sections/delete-wallet-section/delete-wallet-warning'
import { locators as deleteWalletLocators } from '../../../frontend/routes/auth/settings/home/sections/delete-wallet-section/delete-wallet'

export class DeleteWallet {
  constructor(private readonly driver: WebDriver) {}
  private readonly acknowledgeWarningCheckbox: By = By.id('accept')
  private readonly continueButton: By = getByDataTestID(warningLocators.deleteWalletWarningContinueButton)

  openModal() {
    return clickElement(this.driver, getByDataTestID(deleteWalletLocators.deleteWalletTrigger))
  }

  acceptTerms() {
    return clickElement(this.driver, this.acknowledgeWarningCheckbox)
  }

  confirmDelete() {
    return clickElement(this.driver, this.continueButton)
  }
}
