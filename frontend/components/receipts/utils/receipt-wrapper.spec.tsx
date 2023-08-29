import { render, screen } from '@testing-library/react'
import { ReceiptWrapper, locators } from './receipt-wrapper'

describe('ReceiptView', () => {
  it('should render vega section, title and children', () => {
    render(
      <ReceiptWrapper>
        <div>Child</div>
      </ReceiptWrapper>
    )
    expect(screen.getByTestId(locators.receiptWrapper)).toBeInTheDocument()
    expect(screen.getByText('Child')).toBeInTheDocument()
  })
})
