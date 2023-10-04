import { render, screen } from '@testing-library/react'
import { BasicWithdrawal } from './basic-withdrawal'

jest.mock('../utils/string-amounts/amount-with-tooltip', () => ({
  AmountWithTooltip: () => <div data-testid="amount-with-tooltip" />
}))

describe('BasicWithdrawal', () => {
  it('renders AmountWithTooltip with the correct amount and asset props', () => {
    render(<BasicWithdrawal receiverAddress="0x12345678" amount="10" asset="ETH" />)

    expect(screen.getByTestId('amount-with-tooltip')).toBeInTheDocument()
  })
})
