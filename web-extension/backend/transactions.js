import { v4 as uuidv4 } from 'uuid'

export class TransactionsCollection {
  constructor({ store }) {
    this.transactionStore = store
  }

  async addTx(transaction, wallet, publicKey) {
    const existingTransactions = (await this.transactionStore.get(wallet)) ?? {}
    const existingTransactionByPublicKey = existingTransactions[publicKey] ?? []
    await this.transactionStore.set(wallet, {
      ...existingTransactions,
      [publicKey]: [transaction, ...existingTransactionByPublicKey]
    })
  }

  async listTxs(wallet) {
    const transactions = (await this.transactionsStore.get(wallet)) ?? {}
    return { transactions }
  }

  static generateStoreTx({
    transaction,
    publicKey,
    sendingMode,
    keyName,
    walletName,
    origin,
    networkId,
    chainId,
    receivedAt,
    state
  }) {
    return {
      // Cannot use tx hash as an id as rejected transactions do not have a hash
      id: uuidv4(),
      transaction,
      publicKey,
      sendingMode,
      keyName,
      walletName,
      origin,
      networkId,
      chainId,
      decision: new Date().toISOString(),
      state,
      receivedAt,
      node: null,
      error: null,
      hash: null,
      code: null
    }
  }
}
