import { screen, render } from '@testing-library/react'
import { OrderType } from '@vegaprotocol/types'
import { OrderPriceComponent, locators as OrderPriceLocators } from './order-price'
import { locators as PriceWithTooltipLocators } from '../string-amounts/price-with-tooltip'
import { locators as PriceWithSymbolLocators } from '../string-amounts/price-with-symbol'

describe('OrderPriceComponent', () => {
  // 1118-ORDS-013 I can see 'Market price'
  it('should return "Market price" if tx is of market type', () => {
    render(
      <OrderPriceComponent
        assetsLoading={false}
        price="0"
        marketId="someMarketId"
        formattedPrice="10"
        symbol="BTC"
        type={OrderType.TYPE_MARKET}
      />
    )
    expect(screen.getByTestId(OrderPriceLocators.orderDetailsMarketPrice).textContent).toBe('Market price')
  })

  it('should not display if price or marketId is not defined or zero (and not market type)', () => {
    render(
      <OrderPriceComponent
        assetsLoading={false}
        price="0"
        marketId={undefined}
        formattedPrice="10"
        symbol="BTC"
        type={undefined}
      />
    )
    expect(screen.queryByTestId(OrderPriceLocators.orderDetailsMarketPrice)).not.toBeInTheDocument()
    expect(screen.queryByTestId(PriceWithTooltipLocators.priceWithTooltip)).not.toBeInTheDocument()
    expect(screen.queryByTestId(PriceWithSymbolLocators.priceWithSymbol)).not.toBeInTheDocument()
  })

  it('should return basic price tooltip if assets are loading or formattedPrice or symbol is not defined', () => {
    render(
      <OrderPriceComponent
        assetsLoading={true}
        price="10"
        marketId="someMarketId"
        formattedPrice="10"
        symbol="BTC"
        type={undefined}
      />
    )
    expect(screen.getByTestId(PriceWithTooltipLocators.priceWithTooltip)).toBeInTheDocument()
  })

  // 1118-ORDS-013 When available, I see enriched data for the order price (Correctly formatted asset decimals and suffix)
  it('should return enriched data otherwise', () => {
    render(
      <OrderPriceComponent
        assetsLoading={false}
        price="10"
        marketId="someMarketId"
        formattedPrice="10"
        symbol="BTC"
        type={undefined}
      />
    )
    expect(screen.getByTestId(PriceWithSymbolLocators.priceWithSymbol)).toBeInTheDocument()
  })
})
