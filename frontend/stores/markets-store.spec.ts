import { RpcMethods } from '../lib/client-rpc-methods'
import { useMarketsStore } from './markets-store'

const marketsMock = [
  {
    markets: {
      edges: [
        {
          node: {
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
          },
          cursor:
            'eyJ2ZWdhVGltZSI6IjIwMjMtMDktMThUMDY6MzI6MTIuODM1MDY2WiIsImlkIjoiM2FiNGZjMGVhN2U2ZWFiZTc0MTMzZmIxNGVmMmQ4OTM0ZmYyMWRkODk0ZmYwODBhMDllYzlhMzY0N2NlYjJhNCJ9'
        },
        {
          node: {
            id: '10c7d40afd910eeac0c2cad186d79cb194090d5d5f13bd31e14c49fd1bded7e2',
            tradableInstrument: {
              instrument: {
                id: '',
                code: 'UNIDAI.MF21',
                name: 'UNIDAI Monthly (Feb 2023)',
                metadata: {
                  tags: [
                    'formerly:3C58ED2A4A6C5D7E',
                    'base:UNI',
                    'quote:DAI',
                    'class:fx/crypto',
                    'monthly',
                    'sector:defi',
                    'auto:unidai'
                  ]
                },
                future: {
                  settlementAsset: 'b340c130096819428a62e5df407fd6abe66e444b89ad64f670beb98621c9c663',
                  quoteName: 'DAI',
                  dataSourceSpecForSettlementData: {
                    id: 'a252d1f65201b4af162192e663b50e917328f816868f08bb9a00649571709db4',
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
                                name: 'prices.UNI.value',
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
                    id: '9505dd835aeaaeee743b66ca05da43d06f03b37edb9aae28ea2adc3d58719078',
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
                                name: 'termination.UNI.value',
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
                    settlementDataProperty: 'prices.UNI.value',
                    tradingTerminationProperty: 'termination.UNI.value'
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
                riskAversionParameter: 0.01,
                tau: 0.0001140771161,
                params: {
                  mu: 0,
                  r: 0.016,
                  sigma: 0.5
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
              open: '1683310965255859729',
              close: '0'
            },
            positionDecimalPlaces: '3',
            lpPriceRange: '0.5',
            linearSlippageFactor: '0.1',
            quadraticSlippageFactor: '0.1'
          },
          cursor:
            'eyJ2ZWdhVGltZSI6IjIwMjMtMDktMThUMDY6MzI6MTIuODM1MDY2WiIsImlkIjoiMTBjN2Q0MGFmZDkxMGVlYWMwYzJjYWQxODZkNzljYjE5NDA5MGQ1ZDVmMTNiZDMxZTE0YzQ5ZmQxYmRlZDdlMiJ9'
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
]

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
    expect(useMarketsStore.getState().markets).toBeNull()
    await useMarketsStore.getState().fetchMarkets(request as unknown as any)
    expect(useMarketsStore.getState().loading).toBe(false)
    expect(useMarketsStore.getState().markets).toStrictEqual(marketsMock)
  })

  it('sets loading state while fetching', async () => {
    useMarketsStore.getState().fetchMarkets(request as unknown as any)
    expect(useMarketsStore.getState().loading).toBe(true)
  })

  it('allows you to fetch a market by id', async () => {
    await useMarketsStore.getState().fetchMarkets(request as unknown as any)
    const market = useMarketsStore
      .getState()
      .getMarketById('3ab4fc0ea7e6eabe74133fb14ef2d8934ff21dd894ff080a09ec9a3647ceb2a4')
    expect(market).toStrictEqual(marketsMock[0].markets.edges[0].node)
  })

  it('throws error if the market is not found', async () => {
    await useMarketsStore.getState().fetchMarkets(request as unknown as any)
    expect(() =>
      useMarketsStore.getState().getMarketById('3ab4fc0ea7e6eabe74133fb14ef2d8934ff21dd894ff080a09ec9a3647ceb2a5')
    ).toThrowError('Market with id 3ab4fc0ea7e6eabe74133fb14ef2d8934ff21dd894ff080a09ec9a3647ceb2a5 not found')
  })
})
