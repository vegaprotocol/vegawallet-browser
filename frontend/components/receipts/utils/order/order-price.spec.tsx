import { screen, render } from '@testing-library/react'
import { vegaOrderType } from '@vegaprotocol/rest-clients/dist/trading-data'
import { OrderPriceComponent, locators as orderPriceLocators } from './order-price'
import { locators as priceWithTooltipLocators } from '../string-amounts/price-with-tooltip'
import { locators as amountWithSymbolLocators } from '../string-amounts/amount-with-symbol'

describe('OrderPriceComponent', () => {
  it('should return "Market price" if tx is of market type', () => {
    // 1118-ORDS-010 I can see 'Market price'
    render(
      <OrderPriceComponent
        assetsLoading={false}
        price="0"
        marketId="someMarketId"
        formattedPrice="10"
        symbol="BTC"
        type={vegaOrderType.TYPE_MARKET}
      />
    )
    expect(screen.getByTestId(orderPriceLocators.orderDetailsMarketPrice).textContent).toBe('Market price')
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
    expect(screen.queryByTestId(orderPriceLocators.orderDetailsMarketPrice)).not.toBeInTheDocument()
    expect(screen.queryByTestId(priceWithTooltipLocators.priceWithTooltip)).not.toBeInTheDocument()
    expect(screen.queryByTestId(amountWithSymbolLocators.amountWithSymbol)).not.toBeInTheDocument()
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
    expect(screen.getByTestId(priceWithTooltipLocators.priceWithTooltip)).toBeInTheDocument()
  })

  it('should return enriched data otherwise', () => {
    // 1118-ORDS-013 I see the order price in the enriched data view when data has been loaded successfully
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
    expect(screen.getByTestId(amountWithSymbolLocators.amountWithSymbol)).toBeInTheDocument()
  })
})
