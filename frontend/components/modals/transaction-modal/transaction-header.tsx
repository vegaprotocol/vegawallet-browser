import { TRANSACTION_TITLES, Transaction, TransactionKeys } from '../../../lib/transactions'
import { VegaSection } from '../../vega-section'
import { HostImage } from '../../host-image'
import { KeyIcon } from '../../key-icon'
import { truncateMiddle } from '@vegaprotocol/ui-toolkit'

export const locators = {
  transactionType: 'transaction-type',
  transactionRequest: 'transaction-request',
  transactionKey: 'transaction-key'
}

export const TransactionHeader = ({
  origin,
  publicKey,
  name,
  transaction
}: {
  origin: string
  publicKey: string
  name: string
  transaction: Transaction
}) => {
  return (
    <VegaSection>
      <h1 data-testid={locators.transactionType} className="flex justify-center flex-col text-2xl text-white">
        {TRANSACTION_TITLES[Object.keys(transaction)[0] as TransactionKeys]}
      </h1>
      <div className="flex items-center mt-6 mb-4">
        <HostImage size={42} hostname={origin} />
        <div data-testid={locators.transactionRequest} className="ml-4">
          <span className="text-vega-dark-300">Request from</span> {origin}
        </div>
      </div>
      <div className="flex items-center">
        <KeyIcon publicKey={publicKey} />
        <div className="ml-4" data-testid={locators.transactionKey}>
          <div className="text-vega-dark-300">Signing with</div>
          <p>
            {name}: <span className="text-vega-dark-300">{truncateMiddle(publicKey)}</span>
          </p>
        </div>
      </div>
    </VegaSection>
  )
}
