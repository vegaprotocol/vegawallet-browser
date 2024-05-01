import { By, WebDriver } from 'selenium-webdriver'
import { locators as transactionsListLocators } from '../../../frontend/routes/auth/transactions/home/transactions-list'
import { locators as transactionsPageLocators } from '../../../frontend/routes/auth/transactions/home/transactions'
import {
  clickWebElement,
  getByDataTestID,
  getElements,
  hasTotalNumElements,
  isElementDisplayed
} from '../helpers/selenium-util'

export class TransactionList {
  private readonly transactionListItem: By = getByDataTestID(transactionsListLocators.transactionListItem)
  private readonly transactionListEmpty: By = getByDataTestID(transactionsListLocators.transactionListEmpty)
  private readonly transactionPage: By = getByDataTestID(transactionsPageLocators.transactions)

  constructor(private readonly driver: WebDriver) {}

  async isListTransactionPage() {
    return await isElementDisplayed(this.driver, this.transactionPage)
  }

  async checkOnListTransactionsPage() {
    expect(
      await this.isListTransactionPage(),
      "expected to be on the 'list connections' page but could not locate the connections header",
      { showPrefix: false }
    ).toBe(true)
  }

  async checkNumTransactions(expectedTransactions: number) {
    const listOfConnectionElements = await getElements(this.driver, this.transactionListItem)
    const numberOfTxs = listOfConnectionElements.length
    expect(
      await hasTotalNumElements(numberOfTxs, this.transactionListItem, this.driver),
      `expected ${expectedTransactions} transactions(s), instead found ${numberOfTxs}`
    ).toBe(true)
  }

  async selectTransaction(transactionIndex: number) {
    const listOfConnectionElements = await getElements(this.driver, this.transactionListItem)
    const item = listOfConnectionElements[transactionIndex]
    await clickWebElement(this.driver, item)
  }

  async listEmpty() {
    return await isElementDisplayed(this.driver, this.transactionListEmpty)
  }

  async checkListEmpty() {
    expect(await this.listEmpty(), 'expected the transaction list to be empty but it was not', {
      showPrefix: false
    }).toBe(true)
  }
}
