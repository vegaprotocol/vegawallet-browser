import { ReactNode } from 'react'
import { VegaSection } from '../../vega-section'
import { Intent, Notification } from '@vegaprotocol/ui-toolkit'
import { useAssetsStore } from '../../../stores/assets-store'
import { useMarketsStore } from '../../../stores/markets-store'

export const locators = {
  receiptWrapper: 'receipt-wrapper',
  receiptWrapperError: 'receipt-wrapper-error'
}

// TODO handle data loading here, with render prop and loading/error states
export const ReceiptWrapper = ({ children, errors = [] }: { children: ReactNode; errors?: Error[] }) => {
  const { error: assetsError } = useAssetsStore((state) => ({
    error: state.error
  }))
  const { error: marketsError } = useMarketsStore((state) => ({
    error: state.error
  }))
  const allErrors = [assetsError, marketsError, ...errors].filter(Boolean) as Error[]
  const hasError = allErrors.length > 0
  return (
    <VegaSection>
      {!hasError && <section data-testid={locators.receiptWrapper}>{children}</section>}
      <div className="mt-4">
        <Notification
          intent={Intent.Warning}
          testId={locators.receiptWrapperError}
          title="Error loading data"
          message="Additional data to display your transaction could not be loaded. The transaction can still be sent, but only transaction data can be shown."
          buttonProps={{
            action: () => {
              navigator.clipboard.writeText(allErrors.map((e) => e.stack).join('. \n'))
            },
            text: 'Copy error message(s)'
          }}
        />
      </div>
    </VegaSection>
  )
}
