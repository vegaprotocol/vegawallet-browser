import React from 'react'
import { render, screen } from '@testing-library/react'
import { vegaOrderType, vegaPeggedReference, vegaSide } from '@vegaprotocol/rest-clients/dist/trading-data'
import {
  buildDirectionColumn,
  buildMarketColumn,
  buildOrderColumn,
  buildPeggedOrderColumn,
  buildPriceColumn,
  buildReferenceColumn,
  buildSizeColumn,
  buildTypeColumn
} from './build-order-columns'

jest.mock('./order-price', () => {
  return {
    OrderPriceComponent: () => <div data-testid="order-price-component" />
  }
})

describe('buildPriceColumn', () => {
  it('returns Price column when shouldDisplayPrice is true', () => {
    const result = buildPriceColumn(true, false, '100', '1', '100.00', 'USD', vegaOrderType.TYPE_LIMIT)

    render(<>{result}</>)
    expect(screen.getByTestId('order-price-component')).toBeInTheDocument()
  })

  it('returns null when shouldDisplayPrice is false', () => {
    const result = buildPriceColumn(false, false, '100', '1', '100.00', 'USD', vegaOrderType.TYPE_LIMIT)
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
  it('returns Order column when orderId is defined', () => {
    const result = buildOrderColumn('1')

    render(<>{result}</>)
    expect(screen.getByText('Order1')).toBeInTheDocument()
  })

  it('returns null when orderId is undefined', () => {
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
    const result = buildReferenceColumn('1')

    render(<>{result}</>)
    expect(screen.getByText('Reference1')).toBeInTheDocument()
  })

  it('returns null when reference is undefined', () => {
    const result = buildReferenceColumn()
    expect(result).toBeNull()
  })
})
