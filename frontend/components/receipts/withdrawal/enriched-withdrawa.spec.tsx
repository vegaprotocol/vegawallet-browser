import { render, screen } from '@testing-library/react'
import { useFormatAssetAmount } from '../../../hooks/format-asset-amount'
import { EnrichedWithdrawal } from './enriched-withdrawal'

jest.mock('../../../hooks/format-asset-amount')
jest.mock('../utils/string-amounts/amount-with-symbol', () => ({
  AmountWithSymbol: () => <div data-testid="amount-with-symbol" />
}))

describe('EnrichedWithdrawal', () => {
  it('renders AmountWithSymbol with the formattedAmount and symbol from useFormatAssetAmount hook', () => {
    ;(useFormatAssetAmount as unknown as jest.Mock).mockReturnValue({
      formattedAmount: '10.00',
      symbol: 'ETH'
    })

    render(<EnrichedWithdrawal receiverAddress="0x12345678" amount="10" asset="ETH" />)

    expect(screen.getByTestId('amount-with-symbol')).toBeInTheDocument()
  })
})
