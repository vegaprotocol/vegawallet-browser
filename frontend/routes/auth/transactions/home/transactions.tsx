import { ExternalLink } from '@/components/external-link'
import { BasePage } from '@/components/pages/page'
import { useNetwork } from '@/contexts/network/network-context'
import { useTransactionsStore } from '@/stores/transactions-store'

import { TransactionsList } from './transactions-list'

export const locators = {
  transactions: 'transactions',
  transactionsDescription: 'transactions-description'
}

export const Transactions = () => {
  const { network } = useNetwork()
  const { transactions } = useTransactionsStore((state) => ({
    transactions: state.transactions
  }))

  return (
    <BasePage dataTestId={locators.transactions} title="Transactions">
      <div className="mt-6">
        <p className="text-sm">
          This only includes transactions placed from this wallet, in order to see all transactions you can visit the{' '}
          <ExternalLink className="text-white mt-1" href={network.explorer}>
            <span className="underline">block explorer.</span>
          </ExternalLink>
        </p>
        <TransactionsList transactions={transactions} />
      </div>
    </BasePage>
  )
}
