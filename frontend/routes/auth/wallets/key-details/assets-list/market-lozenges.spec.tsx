import { render, screen } from '@testing-library/react'
import { MarketLozenges, locators } from './markets-lozenges'
import { useMarketsStore } from '../../../../../stores/markets-store'
import config from '../../../../../lib/config'
import { mockStore } from '../../../../../test-helpers/mock-store'
import { MarketTradingMode } from '@vegaprotocol/rest-clients/dist/trading-data'

jest.mock('../../../../../stores/markets-store')

describe('MarketLozenges', () => {
  it('renders a lozenge for each market', () => {
    mockStore(useMarketsStore, {
      getMarketsByAssetId: () => [
        {
          id: '1',
          tradingMode: MarketTradingMode.TRADING_MODE_CONTINUOUS,
          tradableInstrument: {
            instrument: {
              code: 'BTC/USD'
            }
          }
        },
        {
          id: '2',
          tradingMode: MarketTradingMode.TRADING_MODE_CONTINUOUS,
          tradableInstrument: {
            instrument: {
              code: 'ETH/USD'
            }
          }
        }
      ]
    })

    render(<MarketLozenges assetId="1" />)
    expect(screen.getByTestId(locators.marketsDescription)).toHaveTextContent('Currently traded in:')
    expect(screen.getAllByTestId(locators.marketLozenge)).toHaveLength(2)
  })
  it('renders only the first 5 markets if many are present, with links to console', () => {
    // 1125-KEYD-001 The lozenges shown link to that market in Console
    mockStore(useMarketsStore, {
      getMarketsByAssetId: () => [
        {
          id: '1',
          tradingMode: MarketTradingMode.TRADING_MODE_CONTINUOUS,
          tradableInstrument: {
            instrument: {
              code: 'BTC/USD'
            }
          }
        },
        {
          id: '2',
          tradingMode: MarketTradingMode.TRADING_MODE_CONTINUOUS,
          tradableInstrument: {
            instrument: {
              code: 'ETH/USD'
            }
          }
        },
        {
          id: '3',
          tradingMode: MarketTradingMode.TRADING_MODE_CONTINUOUS,
          tradableInstrument: {
            instrument: {
              code: 'BTC/ETH'
            }
          }
        },
        {
          id: '4',
          tradingMode: MarketTradingMode.TRADING_MODE_CONTINUOUS,
          tradableInstrument: {
            instrument: {
              code: 'USD/BTC'
            }
          }
        },
        {
          id: '5',
          tradingMode: MarketTradingMode.TRADING_MODE_CONTINUOUS,
          tradableInstrument: {
            instrument: {
              code: 'ETH/BTC'
            }
          }
        },
        {
          id: '6',
          tradingMode: MarketTradingMode.TRADING_MODE_CONTINUOUS,
          tradableInstrument: {
            instrument: {
              code: 'USD/ETH'
            }
          }
        }
      ]
    })
    render(<MarketLozenges assetId="1" />)
    const lozenges = screen.getAllByTestId(locators.marketLozenge)
    expect(lozenges).toHaveLength(5)
    expect(lozenges[0]).toHaveAttribute('href', `${config.network.console}/#/markets/1`)
    expect(lozenges[1]).toHaveAttribute('href', `${config.network.console}/#/markets/2`)
    expect(lozenges[2]).toHaveAttribute('href', `${config.network.console}/#/markets/3`)
    expect(lozenges[3]).toHaveAttribute('href', `${config.network.console}/#/markets/4`)
    expect(lozenges[4]).toHaveAttribute('href', `${config.network.console}/#/markets/5`)
  })
  it('renders only markets that are active', () => {
    // 1125-KEYD-001 The lozenges shown link to that market in Console
    mockStore(useMarketsStore, {
      getMarketsByAssetId: () => [
        {
          id: '1',
          tradingMode: MarketTradingMode.TRADING_MODE_CONTINUOUS,
          tradableInstrument: {
            instrument: {
              code: 'BTC/USD'
            }
          }
        },
        {
          id: '2',
          tradingMode: MarketTradingMode.TRADING_MODE_MONITORING_AUCTION,
          tradableInstrument: {
            instrument: {
              code: 'ETH/USD'
            }
          }
        },
        {
          id: '3',
          tradingMode: MarketTradingMode.TRADING_MODE_NO_TRADING,
          tradableInstrument: {
            instrument: {
              code: 'BTC/ETH'
            }
          }
        },
        {
          id: '4',
          tradingMode: MarketTradingMode.TRADING_MODE_NO_TRADING,
          tradableInstrument: {
            instrument: {
              code: 'USD/BTC'
            }
          }
        },
        {
          id: '5',
          tradingMode: MarketTradingMode.TRADING_MODE_NO_TRADING,
          tradableInstrument: {
            instrument: {
              code: 'ETH/BTC'
            }
          }
        },
        {
          id: '6',
          tradingMode: MarketTradingMode.TRADING_MODE_NO_TRADING,
          tradableInstrument: {
            instrument: {
              code: 'USD/ETH'
            }
          }
        }
      ]
    })
    render(<MarketLozenges assetId="1" />)
    const lozenges = screen.getAllByTestId(locators.marketLozenge)
    expect(lozenges).toHaveLength(2)
  })
  it('renders nothing if there are no markets', () => {
    mockStore(useMarketsStore, {
      getMarketsByAssetId: () => []
    })

    render(<MarketLozenges assetId="1" />)
    expect(screen.queryAllByTestId(locators.marketLozenge)).toHaveLength(0)
  })
})
