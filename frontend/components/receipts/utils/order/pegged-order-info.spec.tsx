import { render, screen } from '@testing-library/react'
import { PeggedOrderInfo } from './pegged-order-info'
import { PeggedOrder, PeggedReference } from '@vegaprotocol/types'
import { VegaMarket } from '../../../../types/rest-api'
import { generateMarket } from '../../../../test-helpers/generate-market.ts'
import { locators as PriceWithSymbolLocators } from '../string-amounts/price-with-symbol'
import { locators as PriceWithTooltipLocators } from '../string-amounts/price-with-tooltip'

describe('PeggedOrderInfo', () => {
  const marketId = 'someMarketId'

  it('should render basic data when markets are loading or market is undefined', () => {
    const peggedOrder: PeggedOrder = {
      offset: '12',
      reference: PeggedReference.PEGGED_REFERENCE_BEST_BID
    }
    render(<PeggedOrderInfo marketsLoading={true} peggedOrder={peggedOrder} marketId={marketId} />)
    expect(screen.getByTestId(PriceWithTooltipLocators.priceWithTooltip)).toHaveTextContent('12')
  })

  it('should render enriched data when markets are not loading and market is defined', () => {
    const peggedOrder: PeggedOrder = {
      offset: '12',
      reference: PeggedReference.PEGGED_REFERENCE_BEST_BID
    }

    const mockMarket: VegaMarket = generateMarket({
      decimalPlaces: '2'
    })

    render(
      <PeggedOrderInfo
        marketsLoading={false}
        peggedOrder={peggedOrder}
        market={mockMarket}
        marketId={marketId}
        symbol="BTC"
      />
    )
    expect(screen.getByTestId(PriceWithSymbolLocators.price)).toHaveTextContent('0.12')
    expect(screen.getByTestId(PriceWithSymbolLocators.symbol)).toHaveTextContent('BTC')
  })

  it('should display PeggedReference values correctly', () => {
    const testCases = [
      { reference: PeggedReference.PEGGED_REFERENCE_BEST_BID, expectedText: 'from best bid' },
      { reference: PeggedReference.PEGGED_REFERENCE_BEST_ASK, expectedText: 'from best ask' },
      { reference: PeggedReference.PEGGED_REFERENCE_MID, expectedText: 'from mid' }
    ]

    for (const { reference, expectedText } of testCases) {
      const peggedOrder: PeggedOrder = {
        offset: '12',
        reference
      }
      render(<PeggedOrderInfo marketsLoading={true} peggedOrder={peggedOrder} marketId={marketId} />)
      expect(screen.getByText(expectedText)).toBeInTheDocument()
    }
  })
})
