import { render, screen } from '@testing-library/react'
import {
  vegaOrderStatus,
  vegaOrderType,
  vegaPeggedReference,
  vegaSide
} from '@vegaprotocol/rest-clients/dist/trading-data'
import {
  buildDirectionColumn,
  buildMarketColumn,
  buildOrderColumn,
  buildPeggedOrderColumn,
  buildPriceColumn,
  buildReferenceColumn,
  buildSizeColumn,
  buildTypeColumn,
  buildCreatedAtColumn,
  buildUpdatedAtColumn,
  buildRemainingColumn,
  buildStatusColumn,
  buildVersionColumn
} from './build-order-columns'

jest.mock('./order-price', () => {
  return {
    OrderPriceComponent: () => <div data-testid="order-price-component" />
  }
})

describe('buildPriceColumn', () => {
  it('returns Price column when shouldDisplayPrice is true', () => {
    const result = buildPriceColumn(false, '100', '1', '100.00', 'USD', vegaOrderType.TYPE_LIMIT)

    render(<>{result}</>)
    expect(screen.getByTestId('order-price-component')).toBeInTheDocument()
  })

  it('returns null when price is unset', () => {
    const result = buildPriceColumn(false, undefined, '1', '100.00', 'USD', vegaOrderType.TYPE_LIMIT)
    expect(result).toBeNull()
  })
})

jest.mock('./pegged-order-info', () => {
  return {
    PeggedOrderInfo: () => <div data-testid="pegged-order-info" />
  }
})

describe('buildPeggedOrderColumn', () => {
  it('returns Pegged price column when peggedOrder and marketId are defined', () => {
    const result = buildPeggedOrderColumn(
      false,
      { offset: '12', reference: vegaPeggedReference.PEGGED_REFERENCE_BEST_BID },
      '1',
      {},
      'BTC'
    )

    render(<>{result}</>)
    expect(screen.getByTestId('pegged-order-info')).toBeInTheDocument()
  })

  it('returns null when peggedOrder is undefined', () => {
    const result = buildPeggedOrderColumn(false, undefined, '1', {}, 'BTC')
    expect(result).toBeNull()
  })

  it('returns null when marketId is undefined', () => {
    const result = buildPeggedOrderColumn(
      false,
      { offset: '12', reference: vegaPeggedReference.PEGGED_REFERENCE_BEST_BID },
      undefined,
      {},
      'BTC'
    )
    expect(result).toBeNull()
  })
})

jest.mock('./order-size', () => {
  return {
    OrderSizeComponent: () => <div data-testid="order-size-component" />
  }
})

describe('buildSizeColumn', () => {
  it('returns Size column when size and marketId are defined', () => {
    const result = buildSizeColumn(false, '100', '1', '100.00')

    render(<>{result}</>)
    expect(screen.getByTestId('order-size-component')).toBeInTheDocument()
  })

  it('returns null when size is undefined', () => {
    const result = buildSizeColumn(false, undefined, '1', '100.00')
    expect(result).toBeNull()
  })

  it('returns null when marketId is undefined', () => {
    const result = buildSizeColumn(false, '100', undefined, '100.00')
    expect(result).toBeNull()
  })
})

jest.mock('./order-market', () => {
  return {
    OrderMarketComponent: () => <div data-testid="order-market-component" />
  }
})

describe('buildMarketColumn', () => {
  it('returns Market column when marketId is defined', () => {
    const result = buildMarketColumn(false, '1', {})

    render(<>{result}</>)
    expect(screen.getByTestId('order-market-component')).toBeInTheDocument()
  })

  it('returns null when marketId is undefined', () => {
    const result = buildMarketColumn(false, undefined, {})
    expect(result).toBeNull()
  })
})

describe('buildOrderColumn', () => {
  it('returns Order column when orderId is defined and not isCancellation', () => {
    const result = buildOrderColumn('13579')

    render(<>{result}</>)
    expect(screen.getByText('Order')).toBeInTheDocument()
    expect(screen.getByText('13579')).toBeInTheDocument()
  })

  it('returns null when orderId is undefined and no other arguments', () => {
    const result = buildOrderColumn()
    expect(result).toBeNull()
  })
})

describe('buildDirectionColumn', () => {
  it('returns Direction column when direction is defined', () => {
    const result = buildDirectionColumn(vegaSide.SIDE_SELL)

    render(<>{result}</>)
    expect(screen.getByText('DirectionShort')).toBeInTheDocument()
  })

  it('returns null when direction is undefined', () => {
    const result = buildDirectionColumn()
    expect(result).toBeNull()
  })
})

describe('buildTypeColumn', () => {
  it('returns Type column when type is defined', () => {
    const result = buildTypeColumn(vegaOrderType.TYPE_LIMIT)

    render(<>{result}</>)
    expect(screen.getByText('TypeLimit')).toBeInTheDocument()
  })

  it('returns null when type is undefined', () => {
    const result = buildTypeColumn()
    expect(result).toBeNull()
  })
})

describe('buildReferenceColumn', () => {
  it('returns Reference column when reference is defined', () => {
    const result = buildReferenceColumn('12345')

    render(<>{result}</>)
    expect(screen.getByText('Reference')).toBeInTheDocument()
    expect(screen.getByText('12345')).toBeInTheDocument()
  })

  it('returns null when reference is undefined', () => {
    const result = buildReferenceColumn()
    expect(result).toBeNull()
  })
})

describe('buildCreatedAtColumn', () => {
  it('returns Created At column when createdAt is defined', () => {
    const result = buildCreatedAtColumn('1698146931681252000')

    render(<>{result}</>)
    expect(screen.getByText(/^Created at/)).toBeInTheDocument()
  })

  it('returns null when createdAt is undefined', () => {
    const result = buildCreatedAtColumn()
    expect(result).toBeNull()
  })
})

describe('buildUpdatedAtColumn', () => {
  it('returns Updated At column when updatedAt is defined', () => {
    const result = buildUpdatedAtColumn('1698146931681252000')

    render(<>{result}</>)
    expect(screen.getByText(/^Updated at/)).toBeInTheDocument()
  })

  it('returns null when updatedAt is undefined or "0"', () => {
    let result = buildUpdatedAtColumn()
    expect(result).toBeNull()

    result = buildUpdatedAtColumn('0')
    expect(result).toBeNull()
  })
})

describe('buildRemainingColumn', () => {
  it('returns Remaining column when remaining and marketId are defined', () => {
    const result = buildRemainingColumn(false, '100', '1', '100.00')

    render(<>{result}</>)
    expect(screen.getByTestId('order-size-component')).toBeInTheDocument()
  })

  it('returns null when remaining is undefined', () => {
    const result = buildRemainingColumn(false, undefined, '1', '100.00')
    expect(result).toBeNull()
  })

  it('returns null when marketId is undefined', () => {
    const result = buildRemainingColumn(false, '100', undefined, '100.00')
    expect(result).toBeNull()
  })
})

describe('buildStatusColumn', () => {
  it('returns Status column when status is defined', () => {
    const result = buildStatusColumn(vegaOrderStatus.STATUS_ACTIVE)

    render(<>{result}</>)
    expect(screen.getByText(/^Status/)).toBeInTheDocument()
  })

  it('returns null when status is undefined', () => {
    const result = buildStatusColumn()
    expect(result).toBeNull()
  })
})

describe('buildVersionColumn', () => {
  it('returns Version column when version is defined', () => {
    const result = buildVersionColumn('1.0.0')

    render(<>{result}</>)
    expect(screen.getByText(/^Version/)).toBeInTheDocument()
  })

  it('returns null when version is undefined', () => {
    const result = buildVersionColumn()
    expect(result).toBeNull()
  })
})
