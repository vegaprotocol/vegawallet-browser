import { screen, render } from '@testing-library/react'
import { vegaMarket } from '@vegaprotocol/rest-clients/dist/trading-data'
import { OrderMarket, locators as orderMarketComponentLocators } from './order-market'
import { locators as marketLinkLocators } from './market-link'
import { generateMarket } from '../../../../test-helpers/generate-market.ts'
import { mockStore } from '../../../../test-helpers/mock-store.ts'
import { useMarketsStore } from '../../../../stores/markets-store.ts'

jest.mock('../../../../stores/markets-store')

describe('OrderMarketComponent', () => {
  it('should return basic market link if markets are loading or market is not defined', () => {
    mockStore(useMarketsStore, {
      loading: true,
      getMarketById: () => undefined
    })
    render(<OrderMarket marketId="someMarketId" />)
    expect(screen.getByTestId(marketLinkLocators.marketLink)).toBeInTheDocument()
  })

  it('should return the enriched market code otherwise', () => {
    // 1130-ODTB-011 I see the market code in the enriched data view when data has been loaded successfully
    const mockMarket: vegaMarket = generateMarket()
    mockStore(useMarketsStore, {
      loading: true,
      getMarketById: () => mockMarket
    })

    render(<OrderMarket marketId={mockMarket.id as string} />)
    expect(screen.getByTestId(orderMarketComponentLocators.orderDetailsMarketCode).textContent).toBe(
      mockMarket.tradableInstrument?.instrument?.code as string
    )
  })
})
