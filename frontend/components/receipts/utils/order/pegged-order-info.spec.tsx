import { render, screen } from '@testing-library/react'
import { PeggedOrderInfo } from './pegged-order-info'
import { PeggedOrder, PeggedReference } from '@vegaprotocol/types'

describe('PeggedOrderInfo', () => {
  // 1114-RCPT-026 I can see the offset price
  // 1114-RCPT-027 I can see the reference price
  const marketId = 'someMarketId'

  it('should render without crashing', () => {
    const peggedOrder: PeggedOrder = {
      offset: '12',
      reference: PeggedReference.PEGGED_REFERENCE_BEST_BID
    }
    render(<PeggedOrderInfo peggedOrder={peggedOrder} marketId={marketId} />)
    expect(screen.getByTestId('price-with-tooltip')).toBeInTheDocument()
  })

  it('should display the offset price correctly', () => {
    const peggedOrder: PeggedOrder = {
      offset: '12',
      reference: PeggedReference.PEGGED_REFERENCE_BEST_BID
    }
    render(<PeggedOrderInfo peggedOrder={peggedOrder} marketId={marketId} />)
    expect(screen.getByText('12')).toBeInTheDocument()
  })

  it('should format and display the reference price correctly', () => {
    const peggedOrder: PeggedOrder = {
      offset: '12',
      reference: PeggedReference.PEGGED_REFERENCE_BEST_BID
    }
    render(<PeggedOrderInfo peggedOrder={peggedOrder} marketId={marketId} />)
    expect(screen.getByText('from best bid')).toBeInTheDocument()
  })
})
