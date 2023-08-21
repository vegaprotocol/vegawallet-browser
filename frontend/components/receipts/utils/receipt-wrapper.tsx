import { ReactNode } from 'react'
import { VegaSection } from '../../vega-section'

export const locators = {
  receiptWrapper: 'receipt-wrapper',
  receiptTitle: 'receipt-title'
}

// TODO handle data loading here, with render prop and loading/error states
export const ReceiptWrapper = ({ children, type }: { type: string; children: ReactNode }) => {
  return (
    <VegaSection>
      <section data-testid={locators.receiptWrapper}>
        <h1 className="text-vega-dark-300" data-testid={locators.receiptTitle}>
          {type}
        </h1>
        {children}
      </section>
    </VegaSection>
  )
}
