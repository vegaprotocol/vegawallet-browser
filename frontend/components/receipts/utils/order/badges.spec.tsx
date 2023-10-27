import { render, screen } from '@testing-library/react'
import { OrderBadges } from './badges'
import { silenceErrors } from '../../../../test-helpers/silence-errors'
import { OrderTimeInForce } from '@vegaprotocol/rest-clients/dist/trading-data'

describe('OrderBadges component', () => {
  test('renders Good til date badge when timeInForce is GTT', () => {
    // 1119-ORDB-004 If time in force is GTT then I can see the expiry of the order
    const mockExpiresAt = (1e9).toString()
    render(
      <OrderBadges
        postOnly={false}
        reduceOnly={false}
        timeInForce={OrderTimeInForce.TIME_IN_FORCE_GTT}
        expiresAt={mockExpiresAt}
      />
    )

    expect(screen.getByText('Good til 1/1/1970, 12:00:01 AM')).toBeInTheDocument()
  })

  test('renders TIF badge when timeInForce is not GTT', () => {
    // 1119-ORDB-003 I can see a badge of the order time in force
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
    // 1119-ORDB-001 I can see a badge if the order is post only
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
    // 1119-ORDB-002 I can see a badge if the order is reduce only
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
