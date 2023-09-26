import { render, screen } from '@testing-library/react'
import { MarketLozenges, locators } from './markets-lozenges'
import { useMarketsStore } from '../../../../stores/markets-store'

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
    expect(screen.getAllByTestId(locators.marketLozenge)).toHaveLength(5)
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
