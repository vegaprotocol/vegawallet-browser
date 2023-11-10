import { screen, render } from '@testing-library/react'
import { OrderSize } from './order-size'
import { locators as sizeWithTooltipLocators } from '../string-amounts/size-with-tooltip'
import { locators as amountWithSymbolLocators } from '../string-amounts/amount-with-symbol'
import { mockStore } from '../../../../test-helpers/mock-store'
import { useMarketsStore } from '../../../../stores/markets-store'

jest.mock('../../../../stores/markets-store')

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
