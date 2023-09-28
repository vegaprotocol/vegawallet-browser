import { render, screen } from '@testing-library/react'
import { MarketLozenges, locators } from './markets-lozenges'
import { useMarketsStore } from '../../../../stores/markets-store'
import config from '../../../../lib/config'

jest.mock('../../../../stores/markets-store')

describe('MarketLozenges', () => {
  it('renders a lozenge for each market', () => {
    ;(useMarketsStore as unknown as jest.Mock).mockImplementation((fn) =>
      fn({
        getMarketsByAssetId: () => [
          {
            id: '1',
            tradableInstrument: {
              instrument: {
                name: 'BTC/USD'
              }
            }
          },
          {
            id: '2',
            tradableInstrument: {
              instrument: {
                name: 'ETH/USD'
              }
            }
          }
        ]
      })
    )
    render(<MarketLozenges assetId="1" />)
    expect(screen.getByTestId(locators.marketsDescription)).toHaveTextContent('Currently traded in:')
    expect(screen.getAllByTestId(locators.marketLozenge)).toHaveLength(2)
  })
  it('renders only the first 5 markets if many are present', () => {
    ;(useMarketsStore as unknown as jest.Mock).mockImplementation((fn) =>
      fn({
        getMarketsByAssetId: () => [
          {
            id: '1',
            tradableInstrument: {
              instrument: {
                name: 'BTC/USD'
              }
            }
          },
          {
            id: '2',
            tradableInstrument: {
              instrument: {
                name: 'ETH/USD'
              }
            }
          },
          {
            id: '3',
            tradableInstrument: {
              instrument: {
                name: 'BTC/ETH'
              }
            }
          },
          {
            id: '4',
            tradableInstrument: {
              instrument: {
                name: 'USD/BTC'
              }
            }
          },
          {
            id: '5',
            tradableInstrument: {
              instrument: {
                name: 'ETH/BTC'
              }
            }
          },
          {
            id: '6',
            tradableInstrument: {
              instrument: {
                name: 'USD/ETH'
              }
            }
          }
        ]
      })
    )
    render(<MarketLozenges assetId="1" />)
    const lozenges = screen.getAllByTestId(locators.marketLozenge)
    expect(lozenges).toHaveLength(5)
    expect(lozenges[0]).toHaveAttribute('href', `${config.network.console}/#/markets/1`)
    expect(lozenges[1]).toHaveAttribute('href', `${config.network.console}/#/markets/2`)
    expect(lozenges[2]).toHaveAttribute('href', `${config.network.console}/#/markets/3`)
    expect(lozenges[3]).toHaveAttribute('href', `${config.network.console}/#/markets/4`)
    expect(lozenges[4]).toHaveAttribute('href', `${config.network.console}/#/markets/5`)
    expect(lozenges[5]).toHaveAttribute('href', `${config.network.console}/#/markets/6`)
  })
  it('renders nothing if there are no markets', () => {
    ;(useMarketsStore as unknown as jest.Mock).mockImplementation((fn) =>
      fn({
        getMarketsByAssetId: () => []
      })
    )
    render(<MarketLozenges assetId="1" />)
    expect(screen.queryAllByTestId(locators.marketLozenge)).toHaveLength(0)
  })
})
