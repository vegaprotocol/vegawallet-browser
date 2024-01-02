import { render, screen } from '@testing-library/react'
import { vegaMarket } from '@vegaprotocol/rest-clients/dist/trading-data'

import { MockNetworkProvider } from '@/contexts/network/mock-network-provider'
import { useMarketsStore } from '@/stores/markets-store.ts'
import { generateMarket } from '@/test-helpers/generate-market.ts'
import { mockStore } from '@/test-helpers/mock-store.ts'

import { locators as marketLinkLocators } from '../../../vega-entities/market-link'
import { locators as orderMarketComponentLocators, OrderMarket } from './order-market'

jest.mock('@/stores/markets-store')

const renderComponent = ({ marketId }: { marketId: string }) =>
  render(
    <MockNetworkProvider>
      <OrderMarket marketId={marketId} />
    </MockNetworkProvider>
  )

describe('OrderMarketComponent', () => {
  it('should return basic market link if markets are loading or market is not defined', () => {
    mockStore(useMarketsStore, {
      loading: true,
      getMarketById: () => {}
    })
    renderComponent({ marketId: 'someMarketId' })
    expect(screen.getByTestId(marketLinkLocators.marketLink)).toBeInTheDocument()
  })

  it('should return the enriched market code otherwise', () => {
    // 1130-ODTB-011 I see the market code in the enriched data view when data has been loaded successfully
    const mockMarket: vegaMarket = generateMarket()
    mockStore(useMarketsStore, {
      loading: false,
      getMarketById: () => mockMarket
    })

    renderComponent({ marketId: mockMarket.id! })

    expect(screen.getByTestId(orderMarketComponentLocators.orderDetailsMarketCode).textContent).toBe(
      mockMarket.tradableInstrument?.instrument?.code as string
    )
  })
})
