import { ReactNode } from 'react'
import { VegaSection } from '../../vega-section'

export const locators = {
  receiptWrapper: 'receipt-wrapper'
}

// TODO handle data loading here, with render prop and loading/error states
export const ReceiptWrapper = ({ children }: { children: ReactNode }) => {
  return (
    <VegaSection>
      <section data-testid={locators.receiptWrapper}>{children}</section>
    </VegaSection>
  )
}
