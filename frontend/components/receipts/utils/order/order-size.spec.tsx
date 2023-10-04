import { screen, render } from '@testing-library/react'
import { OrderSizeComponent } from './order-size'
import { locators as SizeWithTooltipLocators } from '../string-amounts/size-with-tooltip'
import { locators as PriceWithSymbolLocators } from '../string-amounts/price-with-symbol'

describe('OrderSizeComponent', () => {
  it('should return SizeWithTooltip if markets are loading or formattedSize or symbol is not defined', () => {
    render(
      <OrderSizeComponent marketsLoading={true} size="100" marketId="someMarketId" formattedSize="100" symbol="BTC" />
    )
    expect(screen.getByTestId(SizeWithTooltipLocators.sizeWithTooltip)).toBeInTheDocument()
  })

  it('should return PriceWithSymbol otherwise', () => {
    render(
      <OrderSizeComponent marketsLoading={false} size="100" marketId="someMarketId" formattedSize="100" symbol="BTC" />
    )
    expect(screen.getByTestId(PriceWithSymbolLocators.priceWithSymbol)).toBeInTheDocument()
  })
})
