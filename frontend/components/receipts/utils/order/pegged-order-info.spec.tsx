import { render, screen } from '@testing-library/react'
import { vegaMarket, vegaPeggedReference } from '@vegaprotocol/rest-clients/dist/trading-data'
import { PeggedOrderInfo } from './pegged-order-info'
import { generateMarket } from '../../../../test-helpers/generate-market.ts'
import { locators as amountWithSymbolLocators } from '../string-amounts/amount-with-symbol'
import { locators as priceWithTooltipLocators } from '../string-amounts/price-with-tooltip'
import { AssetsStore, useAssetsStore } from '../../../../stores/assets-store'
import { MarketsStore, useMarketsStore } from '../../../../stores/markets-store'
import { DeepPartial, mockStore } from '../../../../test-helpers/mock-store'

jest.mock('../../../../stores/assets-store')
jest.mock('../../../../stores/markets-store')

const mockStores = (marketStore: DeepPartial<MarketsStore>, assetStore: DeepPartial<AssetsStore>) => {
  mockStore(useMarketsStore, marketStore)
  mockStore(useAssetsStore, assetStore)
}

const MARKET_MOCK = {
  tradableInstrument: { instrument: { future: { settlementAsset: 'someAssetId' } } },
  marketDecimals: 2
}

const ASSET_MOCK = {
  symbol: 'SYM'
}

describe('PeggedOrderInfo', () => {
  const marketId = 'someMarketId'

  it('should render basic data when markets are loading or market is undefined', () => {
    mockStores(
      {
        loading: true,
        getMarketById: () => undefined
      },
      {
        getAssetById: () => ASSET_MOCK
      }
    )
    const peggedOrder = {
      offset: '12',
      reference: vegaPeggedReference.PEGGED_REFERENCE_BEST_BID
    }
    render(<PeggedOrderInfo marketsLoading={true} peggedOrder={peggedOrder} marketId={marketId} />)
    expect(screen.getByTestId(priceWithTooltipLocators.priceWithTooltip)).toHaveTextContent('12')
  })

  it('should render enriched data when markets are not loading and market is defined', () => {
    mockStores(
      {
        getMarketById: () => MARKET_MOCK
      },
      {
        getAssetById: () => ASSET_MOCK
      }
    )
    const peggedOrder = {
      offset: '12',
      reference: vegaPeggedReference.PEGGED_REFERENCE_BEST_BID
    }

    const mockMarket: vegaMarket = generateMarket({
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
    expect(screen.getByTestId(amountWithSymbolLocators.amount)).toHaveTextContent('0.12')
    expect(screen.getByTestId(amountWithSymbolLocators.symbol)).toHaveTextContent('BTC')
  })

  it('should display PeggedReference values correctly', () => {
    mockStores(
      {
        getMarketById: () => MARKET_MOCK
      },
      {
        getAssetById: () => ASSET_MOCK
      }
    )
    const testCases = [
      { reference: vegaPeggedReference.PEGGED_REFERENCE_BEST_BID, expectedText: 'from best bid' },
      { reference: vegaPeggedReference.PEGGED_REFERENCE_BEST_ASK, expectedText: 'from best ask' },
      { reference: vegaPeggedReference.PEGGED_REFERENCE_MID, expectedText: 'from mid' }
    ]

    for (const { reference, expectedText } of testCases) {
      const peggedOrder = {
        offset: '12',
        reference
      }
      render(<PeggedOrderInfo marketsLoading={true} peggedOrder={peggedOrder} marketId={marketId} />)
      expect(screen.getByText(expectedText)).toBeInTheDocument()
    }
  })
})
