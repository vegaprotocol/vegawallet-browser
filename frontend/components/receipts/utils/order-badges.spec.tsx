import { render, screen } from '@testing-library/react'
import { OrderBadges } from './order-badges'
import { OrderTimeInForce } from '@vegaprotocol/types'
import { silenceErrors } from '../../../test-helpers/silence-errors'

describe('OrderBadges component', () => {
  test('renders Good til date badge when timeInForce is GTT', () => {
    const mockExpiresAt = '2022-01-01T00:00:00.000Z'
    render(
      <OrderBadges
        postOnly={false}
        reduceOnly={false}
        timeInForce={OrderTimeInForce.TIME_IN_FORCE_GTT}
        expiresAt={mockExpiresAt}
      />
    )

    expect(screen.getByText('Good til 1/1/2022, 12:00:00 AM')).toBeInTheDocument()
  })

  test('renders TIF badge when timeInForce is not GTT', () => {
    render(
      <OrderBadges
        postOnly={false}
        reduceOnly={false}
        timeInForce={OrderTimeInForce.TIME_IN_FORCE_GTC}
        expiresAt={undefined}
      />
    )

    expect(screen.getByText('GTC')).toBeVisible()
  })

  test('renders post only badge when postOnly is true', () => {
    render(
      <OrderBadges
        postOnly={true}
        reduceOnly={false}
        timeInForce={OrderTimeInForce.TIME_IN_FORCE_GTC}
        expiresAt={undefined}
      />
    )
    expect(screen.getByText('Post only')).toBeVisible()
  })

  test('renders reduce only badge when reduceOnly is true', () => {
    render(
      <OrderBadges
        postOnly={false}
        reduceOnly={true}
        timeInForce={OrderTimeInForce.TIME_IN_FORCE_GTC}
        expiresAt={undefined}
      />
    )

    expect(screen.getByText('Reduce only')).toBeVisible()
  })

  test('throws error if GTT order does not have expiresAt', () => {
    silenceErrors()
    expect(() =>
      render(
        <OrderBadges
          postOnly={false}
          reduceOnly={false}
          timeInForce={OrderTimeInForce.TIME_IN_FORCE_GTT}
          expiresAt={undefined}
        />
      )
    ).toThrowError('GTT order without expiresAt')
  })
})
