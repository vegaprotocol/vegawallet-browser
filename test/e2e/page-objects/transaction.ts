import { By, WebDriver } from 'selenium-webdriver'
import { clickElement, getByDataTestID, isElementDisplayed } from '../selenium-util'
import { locators } from '../../../frontend/components/transaction-modal/transaction-modal'

export class Transaction {
  private readonly confirm: By = getByDataTestID(locators.transactionModalApproveButton)
  private readonly reject: By = getByDataTestID(locators.transactionModalDenyButton)

  constructor(private readonly driver: WebDriver) {}

  async confirmTransaction() {
    await clickElement(this.driver, this.confirm)
  }

  async rejectTransaction() {
    await clickElement(this.driver, this.reject)
  }

  async checkOnTransactionPage() {
    expect(
      await isElementDisplayed(this.driver, this.confirm),
      "expected to be on the confirm/reject transaction view but couldn't find the confirm button",
      { showPrefix: false }
    ).toBe(true)
  }
}
