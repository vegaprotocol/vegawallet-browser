import { truncateMiddle } from '@vegaprotocol/ui-toolkit'
import { Intent, Notification } from '@vegaprotocol/ui-toolkit'
import { NavLink, useParams } from 'react-router-dom'

import { DataTable } from '@/components/data-table'
import { ExternalLink } from '@/components/external-link'
import { VegaKey } from '@/components/keys/vega-key'
import { getTitle } from '@/components/modals/transaction-modal/get-title'
import { RawTransaction } from '@/components/modals/transaction-modal/raw-transaction'
import { BasePage } from '@/components/pages/page'
import { TransactionSwitch } from '@/components/receipts'
import { SubHeader } from '@/components/sub-header'
import { VegaSection } from '@/components/vega-section'
import { useNetwork } from '@/contexts/network/network-context'
import { formatDateTime } from '@/lib/utils'
import { FULL_ROUTES } from '@/routes/route-names'
import { useTransactionsStore } from '@/stores/transactions-store'

import { VegaTransactionState } from '../transactions-state'

export const TransactionDetails = () => {
  const { id } = useParams<{ id: string }>()
  const { network } = useNetwork()
  const { transactions } = useTransactionsStore((state) => ({
    transactions: state.transactions
  }))
  const transaction = transactions.find((tx) => tx.id === id)
  if (!transaction) {
    throw new Error(`Could not find transaction with id ${id}`)
  }

  return (
    <BasePage
      backLocation={FULL_ROUTES.transactions}
      dataTestId={'transaction'}
      title={getTitle(transaction.transaction)}
    >
      <section className="mt-6">
        <div className="mb-2">
          <VegaTransactionState state={transaction.state} />
        </div>
        {transaction.error && <Notification intent={Intent.Danger} message={transaction.error} />}
        <VegaSection>
          <SubHeader content="Transaction Details" />
          <h1 className="text-vega-dark-300 mt-4">From:</h1>
          <VegaKey publicKey={transaction.publicKey} key={transaction.keyName} />
          <div className="mt-2">
            <DataTable
              items={[
                [
                  'Hash',
                  <ExternalLink href={`${network.explorer}/txs/${transaction.hash}`}>
                    {truncateMiddle(transaction.hash)}
                  </ExternalLink>
                ],
                [
                  'Network',
                  <NavLink
                    className="text-white underline"
                    to={`${FULL_ROUTES.networksSettings}/${transaction.networkId}`}
                  >
                    {transaction.networkId}
                  </NavLink>
                ],
                ['Node', <ExternalLink href={transaction.node}>{transaction.node}</ExternalLink>],
                ['Origin', <ExternalLink href={transaction.origin}>{transaction.origin}</ExternalLink>],
                ['Sent', `Sent at ${formatDateTime(new Date(transaction.receivedAt).getTime())}`]
              ]}
            />
          </div>
        </VegaSection>
        <VegaSection>
          <SubHeader content="Transaction data" />
          {/* TODO Show errors if data cannot be rendered (failed to read tx) */}
          <TransactionSwitch transaction={transaction.transaction} />
          <RawTransaction transaction={transaction.transaction} />
        </VegaSection>
      </section>
    </BasePage>
  )
}
