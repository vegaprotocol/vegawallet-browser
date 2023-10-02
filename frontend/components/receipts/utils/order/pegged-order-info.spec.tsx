import { render, screen } from '@testing-library/react'
import { PeggedOrderInfo } from './pegged-order-info'
import { vegaPeggedReference } from '@vegaprotocol/rest-clients/dist/trading-data'

describe('PeggedOrderInfo', () => {
  const marketId = 'someMarketId'

  it('should render without crashing', () => {
    const peggedOrder = {
      offset: '12',
      reference: vegaPeggedReference.PEGGED_REFERENCE_BEST_BID
    }
    render(<PeggedOrderInfo peggedOrder={peggedOrder} marketId={marketId} />)
    expect(screen.getByTestId('price-with-tooltip')).toBeInTheDocument()
  })

  it('should display the offset price correctly', () => {
    const peggedOrder = {
      offset: '12',
      reference: vegaPeggedReference.PEGGED_REFERENCE_BEST_BID
    }
    render(<PeggedOrderInfo peggedOrder={peggedOrder} marketId={marketId} />)
    expect(screen.getByText('12')).toBeInTheDocument()
  })

  it('should display PeggedReference values correctly', () => {
    const testCases = [
      { reference: vegaPeggedReference.PEGGED_REFERENCE_BEST_BID, expectedText: 'from best bid' },
      { reference: vegaPeggedReference.PEGGED_REFERENCE_BEST_ASK, expectedText: 'from best ask' },
      { reference: vegaPeggedReference.PEGGED_REFERENCE_MID, expectedText: 'from mid' }
    ]

    for (const { reference, expectedText } of testCases) {
      const peggedOrder = {
        offset: '12',
        reference
      }
      render(<PeggedOrderInfo peggedOrder={peggedOrder} marketId={marketId} />)
      expect(screen.getByText(expectedText)).toBeInTheDocument()
    }
  })
})
