import { screen, render } from '@testing-library/react'
import { OrderMarketComponent, locators as OrderMarketComponentLocators } from './order-market'
import { locators as MarketLinkLocators } from './market-link'
import { VegaMarket } from '../../../../types/rest-api'
import { generateMarket } from '../../../../test-helpers/generate-market.ts'

describe('OrderMarketComponent', () => {
  it('should return basic market link if markets are loading or market is not defined', () => {
    render(<OrderMarketComponent marketsLoading={true} marketId="someMarketId" market={undefined} />)
    expect(screen.getByTestId(MarketLinkLocators.marketLink)).toBeInTheDocument()
  })

  // 1118-ORDS-012 When available, I see enriched data for the order size
  it('should return the enriched market code otherwise', () => {
    const mockMarket: VegaMarket = generateMarket()

    render(<OrderMarketComponent marketsLoading={false} marketId={mockMarket.id as string} market={mockMarket} />)
    expect(screen.getByTestId(OrderMarketComponentLocators.orderDetailsMarketCode).textContent).toBe(
      mockMarket.tradableInstrument?.instrument?.code as string
    )
  })
})
