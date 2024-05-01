import { WebDriver } from 'selenium-webdriver'

export class TransactionList {
  constructor(private readonly driver: WebDriver) {}

  async isListTransactionPage() {
    throw new Error('Not implemented')
  }

  async getNumberOfTransactions() {
    throw new Error('Not implemented')
  }

  getTransactionTypes() {
    throw new Error('Not implemented')
  }

  checkNumTransactions(expectedTransactions: number) {
    throw new Error('Not implemented')
  }

  selectTransaction(transactionIndex: number) {
    throw new Error('Not implemented')
  }
}
