import { render, screen } from '@testing-library/react'

import { useMarketsStore } from '@/stores/markets-store'
import { mockStore } from '@/test-helpers/mock-store'

import { locators as amountWithSymbolLocators } from '../string-amounts/amount-with-symbol'
import { locators as sizeWithTooltipLocators } from '../string-amounts/size-with-tooltip'
import { OrderSize } from './order-size'

jest.mock('@/stores/markets-store')

describe('OrderSizeComponent', () => {
  it('should return basic data if markets are loading or formattedSize or symbol is not defined', () => {
    mockStore(useMarketsStore, { loading: true })
    render(<OrderSize size="100" marketId="someMarketId" />)
    expect(screen.getByTestId(sizeWithTooltipLocators.sizeWithTooltip)).toBeInTheDocument()
  })

  it('should return enriched data otherwise', () => {
    // 1130-ODTB-012 I see the order size in the enriched data view when data has been loaded successfully
    mockStore(useMarketsStore, {
      getMarketById: () => ({
        positionDecimalPlaces: 2
      })
    })
    render(<OrderSize size="100" marketId="someMarketId" />)
    expect(screen.getByTestId(amountWithSymbolLocators.amountWithSymbol)).toBeInTheDocument()
  })
})
