import { Intent, Notification, truncateMiddle } from '@vegaprotocol/ui-toolkit'
import { ReactNode } from 'react'
import { NavLink } from 'react-router-dom'

import { DataTable } from '@/components/data-table'
import { ExternalLink } from '@/components/external-link'
import { SubHeader } from '@/components/sub-header'
import { VegaSection } from '@/components/vega-section'
import { useNetwork } from '@/contexts/network/network-context'
import { formatDateTime } from '@/lib/utils'
import { FULL_ROUTES } from '@/routes/route-names'
import { StoredTransaction } from '@/types/backend'

import { VegaTransactionState } from '../transactions-state'

interface TransactionSectionProperties {
  transaction: StoredTransaction
}

export const TransactionMetadata = ({ transaction }: TransactionSectionProperties) => {
  const { network } = useNetwork()
  const cols = [
    [
      'From',
      <ExternalLink
        key="transaction-details-public-key"
        className="text-vega-dark-400"
        href={`${network.explorer}/parties/${transaction.publicKey}`}
      >
        {truncateMiddle(transaction.publicKey)}
      </ExternalLink>
    ],
    transaction.hash
      ? [
          'Hash',
          <ExternalLink key="transaction-details-hash" href={`${network.explorer}/txs/${transaction.hash}`}>
            {truncateMiddle(transaction.hash)}
          </ExternalLink>
        ]
      : null,
    [
      'Network',
      <NavLink
        key="transaction-details-network"
        className="underline"
        to={`${FULL_ROUTES.networksSettings}/${transaction.networkId}`}
      >
        {transaction.networkId}
      </NavLink>
    ],
    [
      'Node',
      <ExternalLink key="transaction-details-node" href={transaction.node}>
        {transaction.node}
      </ExternalLink>
    ],
    [
      'Origin',
      <ExternalLink key="transaction-details-origin" href={transaction.origin}>
        {transaction.origin}
      </ExternalLink>
    ],
    ['Sent', `${formatDateTime(new Date(transaction.receivedAt).getTime())}`]
  ].filter(Boolean) as [ReactNode, ReactNode][]

  return (
    <VegaSection>
      <div className="mb-2">
        <VegaTransactionState state={transaction.state} />
      </div>
      {transaction.error && <Notification intent={Intent.Danger} message={transaction.error} />}
      <SubHeader content="Transaction Details" />
      <div className="mt-2">
        <DataTable items={cols} />
      </div>
    </VegaSection>
  )
}
