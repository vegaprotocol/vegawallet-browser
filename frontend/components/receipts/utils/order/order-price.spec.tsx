import { screen, render } from '@testing-library/react'
import { vegaOrderType } from '@vegaprotocol/rest-clients/dist/trading-data'
import { OrderPriceComponent, locators as orderPriceLocators } from './order-price'
import { locators as priceWithTooltipLocators } from '../string-amounts/price-with-tooltip'
import { locators as amountWithSymbolLocators } from '../string-amounts/amount-with-symbol'
import { DeepPartial, mockStore } from '../../../../test-helpers/mock-store'
import { AssetsStore, useAssetsStore } from '../../../../stores/assets-store'
import { MarketsStore, useMarketsStore } from '../../../../stores/markets-store'

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

describe('OrderPriceComponent', () => {
  it('should return "Market price" if tx is of market type', () => {
    mockStores(
      {
        getMarketById: () => MARKET_MOCK
      },
      {
        getAssetById: () => ASSET_MOCK
      }
    )
    // 1130-ODTB-010 I can see 'Market price'
    render(<OrderPriceComponent price="0" marketId="someMarketId" type={vegaOrderType.TYPE_MARKET} />)
    expect(screen.getByTestId(orderPriceLocators.orderDetailsMarketPrice).textContent).toBe('Market price')
  })

  it('should return basic price tooltip if formatted amount is undefined', () => {
    // Simulate loading the market
    mockStores(
      {
        loading: true,
        getMarketById: () =>  MARKET_MOCK
      },
      {
        getAssetById: () => ASSET_MOCK
      }
    )
    render(<OrderPriceComponent price="10" marketId="someMarketId" type={undefined} />)
    expect(screen.getByTestId(priceWithTooltipLocators.priceWithTooltip)).toBeInTheDocument()
  })

  it('should return enriched data otherwise', () => {
    mockStores(
      {
        getMarketById: () =>  MARKET_MOCK
      },
      {
        getAssetById: () => ASSET_MOCK
      }
    )
    // 1130-ODTB-013 I see the order price in the enriched data view when data has been loaded successfully
    render(<OrderPriceComponent price="10" marketId="someMarketId" type={undefined} />)
    expect(screen.getByTestId(amountWithSymbolLocators.amountWithSymbol)).toBeInTheDocument()
  })
})
