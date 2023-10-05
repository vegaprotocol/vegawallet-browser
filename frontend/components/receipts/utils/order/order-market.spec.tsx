import { screen, render } from '@testing-library/react'
import { vegaMarket } from '@vegaprotocol/rest-clients/dist/trading-data'
import { OrderMarketComponent, locators as orderMarketComponentLocators } from './order-market'
import { locators as marketLinkLocators } from './market-link'
import { generateMarket } from '../../../../test-helpers/generate-market.ts'

describe('OrderMarketComponent', () => {
  it('should return basic market link if markets are loading or market is not defined', () => {
    render(<OrderMarketComponent marketsLoading={true} marketId="someMarketId" market={undefined} />)
    expect(screen.getByTestId(marketLinkLocators.marketLink)).toBeInTheDocument()
  })

  it('should return the enriched market code otherwise', () => {
    // 1118-ORDS-011 I see enriched data for the market (code) when data has been loaded appropriately
    const mockMarket: vegaMarket = generateMarket()

    render(<OrderMarketComponent marketsLoading={false} marketId={mockMarket.id as string} market={mockMarket} />)
    expect(screen.getByTestId(orderMarketComponentLocators.orderDetailsMarketCode).textContent).toBe(
      mockMarket.tradableInstrument?.instrument?.code as string
    )
  })
})
