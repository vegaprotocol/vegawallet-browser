import { render, screen } from '@testing-library/react'
import { Cancellation } from '.'

describe('Cancellation', () => {
  it('should render orderId and marketId', () => {
    render(
      <Cancellation
        transaction={{
          orderCancellation: {
            orderId: 'orderId',
            marketId: 'marketId'
          }
        }}
      />
    )
    expect(screen.getByText('orderId')).toBeInTheDocument()
    expect(screen.getByText('marketId')).toBeInTheDocument()
  })
})
