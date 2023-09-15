import { ReceiptComponentProps } from '../receipts'
import { ReceiptWrapper } from '../utils/receipt-wrapper'

export const locators = {
  header: 'header',
  cancellations: 'cancellations',
  amendments: 'amendments',
  submissions: 'submissions',
  stopOrderSubmissions: 'stop-order-submissions',
  stopOrderCancellations: 'stop-order-cancellations'
}

export const BatchMarketInstructions = ({ transaction }: ReceiptComponentProps) => {
  return (
    <ReceiptWrapper>
      <h1 data-testid={locators.header} className="text-white text-lg">
        Submissions
      </h1>
      <h1 data-testid={locators.header} className="text-white text-lg">
        Cancellations
      </h1>
      <h1 data-testid={locators.header} className="text-white text-lg">
        Amendments
      </h1>
      <h1 data-testid={locators.header} className="text-white text-lg">
        Stop Order Submissions
      </h1>
      <h1 data-testid={locators.header} className="text-white text-lg">
        Stop Order Cancellations
      </h1>
    </ReceiptWrapper>
  )
}
