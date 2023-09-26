import { RpcMethods } from '../lib/client-rpc-methods'
import { VegaMarket } from '../types/rest-api'
import { useMarketsStore } from './markets-store'

const MARKET_FIXTURE = {
  id: '3ab4fc0ea7e6eabe74133fb14ef2d8934ff21dd894ff080a09ec9a3647ceb2a4',
  tradableInstrument: {
    instrument: {
      id: '',
      code: 'BTCUSD.MF21',
      name: 'BTCUSD Monthly (May 2023)',
      metadata: {
        tags: [
          'formerly:076BB86A5AA41E3E',
          'base:BTC',
          'quote:USD',
          'class:fx/crypto',
          'monthly',
          'sector:crypto',
          'auto:btcusd'
        ]
      },
      future: {
        settlementAsset: 'b340c130096819428a62e5df407fd6abe66e444b89ad64f670beb98621c9c663',
        quoteName: 'USD',
        dataSourceSpecForSettlementData: {
          id: 'dafc82b51cb4a3983d1ee2bb35292806bfda9044f85d2cd620aa9c1229b55326',
          createdAt: '0',
          updatedAt: '0',
          data: {
            external: {
              oracle: {
                signers: [
                  {
                    pubKey: {
                      key: '69464e35bcb8e8a2900ca0f87acaf252d50cf2ab2fc73694845a16b7c8a0dc6f'
                    }
                  }
                ],
                filters: [
                  {
                    key: {
                      name: 'prices.BTC.value',
                      type: 'TYPE_INTEGER'
                    },
                    conditions: [
                      {
                        operator: 'OPERATOR_EQUALS',
                        value: '1'
                      }
                    ]
                  }
                ]
              }
            }
          },
          status: 'STATUS_UNSPECIFIED'
        },
        dataSourceSpecForTradingTermination: {
          id: 'ebf6ea8a609ff09f75995327006a491b306c567d6c831f654243d3c125405467',
          createdAt: '0',
          updatedAt: '0',
          data: {
            external: {
              oracle: {
                signers: [
                  {
                    pubKey: {
                      key: '69464e35bcb8e8a2900ca0f87acaf252d50cf2ab2fc73694845a16b7c8a0dc6f'
                    }
                  }
                ],
                filters: [
                  {
                    key: {
                      name: 'termination.BTC.value',
                      type: 'TYPE_BOOLEAN'
                    },
                    conditions: [
                      {
                        operator: 'OPERATOR_EQUALS',
                        value: '1'
                      }
                    ]
                  }
                ]
              }
            }
          },
          status: 'STATUS_UNSPECIFIED'
        },
        dataSourceSpecBinding: {
          settlementDataProperty: 'prices.BTC.value',
          tradingTerminationProperty: 'termination.BTC.value'
        }
      }
    },
    marginCalculator: {
      scalingFactors: {
        searchLevel: 1.1,
        initialMargin: 1.5,
        collateralRelease: 1.7
      }
    },
    logNormalRiskModel: {
      riskAversionParameter: 0.0001,
      tau: 0.0000190129,
      params: {
        mu: 0,
        r: 0.016,
        sigma: 1.25
      }
    }
  },
  decimalPlaces: '5',
  fees: {
    factors: {
      makerFee: '0.0002',
      infrastructureFee: '0.0005',
      liquidityFee: '0.001'
    }
  },
  openingAuction: {
    duration: '60',
    volume: '0'
  },
  priceMonitoringSettings: {
    parameters: {
      triggers: [
        {
          horizon: '43200',
          probability: '0.9999999',
          auctionExtension: '600'
        },
        {
          horizon: '300',
          probability: '0.9999',
          auctionExtension: '60'
        }
      ]
    }
  },
  liquidityMonitoringParameters: {
    targetStakeParameters: {
      timeWindow: '3600',
      scalingFactor: 10
    },
    triggeringRatio: '0',
    auctionExtension: '1'
  },
  tradingMode: 'TRADING_MODE_MONITORING_AUCTION',
  state: 'STATE_SUSPENDED',
  marketTimestamps: {
    proposed: '1683309952620203148',
    pending: '1683309952620203148',
    open: '1683310956958643480',
    close: '0'
  },
  positionDecimalPlaces: '3',
  lpPriceRange: '0.5',
  linearSlippageFactor: '0.1',
  quadraticSlippageFactor: '0.1'
} as unknown as VegaMarket

const marketsMock = {
  markets: {
    edges: [
      {
        node: MARKET_FIXTURE,
        cursor:
          'eyJ2ZWdhVGltZSI6IjIwMjMtMDktMThUMDY6MzI6MTIuODM1MDY2WiIsImlkIjoiM2FiNGZjMGVhN2U2ZWFiZTc0MTMzZmIxNGVmMmQ4OTM0ZmYyMWRkODk0ZmYwODBhMDllYzlhMzY0N2NlYjJhNCJ9'
      }
    ],
    pageInfo: {
      hasNextPage: false,
      hasPreviousPage: false,
      startCursor:
        'eyJ2ZWdhVGltZSI6IjIwMjMtMDktMThUMDY6MzI6MTIuODM1MDY2WiIsImlkIjoiM2FiNGZjMGVhN2U2ZWFiZTc0MTMzZmIxNGVmMmQ4OTM0ZmYyMWRkODk0ZmYwODBhMDllYzlhMzY0N2NlYjJhNCJ9',
      endCursor:
        'eyJ2ZWdhVGltZSI6IjIwMjMtMDUtMDVUMTg6MDU6NTIuNjIwMjAzWiIsImlkIjoiODgxYzUyMGVjNDdkZDFjYjQ5MjE3YmM1NjljMmY0YzhjMGVjZjEwYzgzOTIxNDFlNmVhYjc4YmNjYjRjN2M3YiJ9'
    }
  }
}

const request = async (method: string, options?: any) => {
  if (method === RpcMethods.Fetch && options.path === 'api/v2/markets') {
    return marketsMock
  }
  throw new Error('Failed to fetch markets')
}

const initialState = useMarketsStore.getState()

describe('MarketsStore', () => {
  beforeEach(() => {
    useMarketsStore.setState(initialState)
  })

  it('loads markets', async () => {
    expect(useMarketsStore.getState().loading).toBe(false)
    expect(useMarketsStore.getState().markets).toStrictEqual([])
    await useMarketsStore.getState().fetchMarkets(request as unknown as any)
    expect(useMarketsStore.getState().loading).toBe(false)
    expect(useMarketsStore.getState().markets).toHaveLength(1)
  })

  it('sets loading state while fetching', async () => {
    useMarketsStore.getState().fetchMarkets(request as unknown as any)
    expect(useMarketsStore.getState().loading).toBe(true)
  })

  it('allows you to fetch a market by id', async () => {
    useMarketsStore.setState({ markets: [MARKET_FIXTURE] })
    await useMarketsStore.getState().fetchMarkets(request as unknown as any)
    const market = useMarketsStore
      .getState()
      .getMarketById('3ab4fc0ea7e6eabe74133fb14ef2d8934ff21dd894ff080a09ec9a3647ceb2a4')
    expect(market).toStrictEqual(marketsMock.markets.edges[0].node)
  })

  it('throws error if the market is not found', async () => {
    useMarketsStore.setState({ markets: [] })
    expect(() => useMarketsStore.getState().getMarketById('nope')).toThrowError('Market with id nope not found')
  })

  it('allows you to get markets by asset id', async () => {
    useMarketsStore.setState({
      markets: [
        {
          id: '1',
          tradableInstrument: { instrument: { future: { settlementAsset: 'foo' } } }
        },
        {
          id: '2',
          tradableInstrument: { instrument: { future: { settlementAsset: 'foo' } } }
        },
        {
          id: '3',
          tradableInstrument: { instrument: { future: { settlementAsset: 'bar' } } }
        },
        {
          id: '4',
          tradableInstrument: { instrument: { perpetual: { settlementAsset: 'baz' } } }
        }
      ]
    })
    expect(useMarketsStore.getState().getMarketsByAssetId('foo')).toHaveLength(2)
    expect(useMarketsStore.getState().getMarketsByAssetId('bar')).toHaveLength(1)
    expect(useMarketsStore.getState().getMarketsByAssetId('baz')).toHaveLength(1)
  })

  it('throws error if it could not find the settlement asset of a market', async () => {
    useMarketsStore.setState({
      markets: [
        {
          id: '1',
          // @ts-ignore
          tradableInstrument: { instrument: { someOtherProductType: { settlementAsset: 'foo' } } }
        }
      ]
    })
    expect(() => useMarketsStore.getState().getMarketsByAssetId('foo')).toThrowError(
      'Could not find settlement asset from market 1'
    )
  })
})
