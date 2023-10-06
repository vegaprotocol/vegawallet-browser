import { screen, render } from '@testing-library/react'
import { OrderSizeComponent } from './order-size'
import { locators as sizeWithTooltipLocators } from '../string-amounts/size-with-tooltip'
import { locators as amountWithSymbolLocators } from '../string-amounts/amount-with-symbol'

describe('OrderSizeComponent', () => {
  it('should return basic data if markets are loading or formattedSize or symbol is not defined', () => {
    render(
      <OrderSizeComponent marketsLoading={true} size="100" marketId="someMarketId" formattedSize="100" symbol="BTC" />
    )
    expect(screen.getByTestId(sizeWithTooltipLocators.sizeWithTooltip)).toBeInTheDocument()
  })

  it('should return enriched data otherwise', () => {
    // 1118-ORDS-012 I see the order size in the enriched data view when data has been loaded successfully
    render(
      <OrderSizeComponent marketsLoading={false} size="100" marketId="someMarketId" formattedSize="100" symbol="BTC" />
    )
    expect(screen.getByTestId(amountWithSymbolLocators.priceWithSymbol)).toBeInTheDocument()
  })
})
