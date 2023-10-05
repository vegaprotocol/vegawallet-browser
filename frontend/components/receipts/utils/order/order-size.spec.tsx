import { screen, render } from '@testing-library/react'
import { OrderSizeComponent } from './order-size'
import { locators as sizeWithTooltipLocators } from '../string-amounts/size-with-tooltip'
import { locators as priceWithSymbolLocators } from '../string-amounts/price-with-symbol'

describe('OrderSizeComponent', () => {
  it('should return basic data if markets are loading or formattedSize or symbol is not defined', () => {
    render(
      <OrderSizeComponent marketsLoading={true} size="100" marketId="someMarketId" formattedSize="100" symbol="BTC" />
    )
    expect(screen.getByTestId(sizeWithTooltipLocators.sizeWithTooltip)).toBeInTheDocument()
  })

  // 1118-ORDS-012 I see enriched data for the order size when data has been loaded appropriately
  it('should return enriched data otherwise', () => {
    render(
      <OrderSizeComponent marketsLoading={false} size="100" marketId="someMarketId" formattedSize="100" symbol="BTC" />
    )
    expect(screen.getByTestId(priceWithSymbolLocators.priceWithSymbol)).toBeInTheDocument()
  })
})
