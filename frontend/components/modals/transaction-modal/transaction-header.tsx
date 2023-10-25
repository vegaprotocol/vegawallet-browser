import { Transaction, TRANSACTION_TITLES, TransactionKeys } from '../../../lib/transactions'
import { VegaSection } from '../../vega-section'
import { HostImage } from '../../host-image'
import { Header } from '../../header'
import { VegaKey } from '../../keys/vega-key'
import { SubHeader } from '../../sub-header'

export const locators = {
  transactionRequest: 'transaction-request',
  transactionKey: 'transaction-key'
}

export const getTitle = (transaction: Transaction) => {
  const type = Object.keys(transaction)[0] as TransactionKeys

  // If we have a mass order cancellation (i.e. no order ID, with or without a market ID)
  // then we want to display a different title
  if (
    type === TransactionKeys.ORDER_CANCELLATION &&
    transaction.orderCancellation &&
    !transaction.orderCancellation.orderId
  ) {
    return 'Mass Order Cancellation'
  }

  return TRANSACTION_TITLES[type]
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
      <Header content={getTitle(transaction)} />
      <div className="mb-4 mt-6">
        <SubHeader content="Request from" />
      </div>
      <div className="flex items-center mb-4">
        <HostImage size={42} hostname={origin} />
        <div data-testid={locators.transactionRequest} className="ml-4">
          {origin}
        </div>
      </div>
      <div className="mb-4">
        <SubHeader content="Signing with" />
      </div>
      <VegaKey name={name} publicKey={publicKey} />
    </VegaSection>
  )
}
