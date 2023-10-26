import { By, WebDriver } from 'selenium-webdriver'
import { locators as transactionModalLocators } from '../../../frontend/components/modals/transaction-modal'
import { locators as transferLocators } from '../../../frontend/components/receipts/transfer'
import { locators as receiptLocators } from '../../..//frontend/components/receipts/utils/receipt-wrapper'
import { clickElement, getByDataTestID, isElementDisplayed, waitForElementToDisappear } from '../helpers/selenium-util'

export class Transaction {
  private readonly confirm: By = getByDataTestID(transactionModalLocators.transactionModalApproveButton)
  private readonly reject: By = getByDataTestID(transactionModalLocators.transactionModalDenyButton)
  private readonly errorLoadingData: By = getByDataTestID(receiptLocators.receiptWrapperError)
  private readonly transferWhen: By = getByDataTestID(transferLocators.whenElement)

  constructor(private readonly driver: WebDriver) {}

  async confirmTransaction(waitForModalGone = true) {
    await clickElement(this.driver, this.confirm)
    if (waitForModalGone) {
      await waitForElementToDisappear(this.driver, this.confirm)
    }
  }

  async rejectTransaction(waitForModalGone = true) {
    await clickElement(this.driver, this.reject)
    if (waitForModalGone) {
      await waitForElementToDisappear(this.driver, this.reject)
    }
  }

  async isErrorLoadingDataDisplayed() {
    return await isElementDisplayed(this.driver, this.errorLoadingData)
  }

  async checkReceiptViewPresent() {
    return await isElementDisplayed(this.driver, this.transferWhen, 1)
  }

  async checkOnTransactionPage() {
    expect(
      await isElementDisplayed(this.driver, this.confirm),
      "expected to be on the confirm/reject transaction view but couldn't find the confirm button",
      { showPrefix: false }
    ).toBe(true)
  }
}
