import http from 'node:http'

const ACCOUNT_FIXTURE = {
  owner: 'a44f8757128286b5c82271ae781ab819f18f3e4feb4a64014980aa98ec1fad0a',
  balance: '40000000000000000000',
  asset: 'b340c130096819428a62e5df407fd6abe66e444b89ad64f670beb98621c9c663',
  marketId: '',
  type: 'ACCOUNT_TYPE_GENERAL'
}

export const server = http.createServer((req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*') /* @dev First, read about security */
  res.setHeader('Access-Control-Allow-Methods', '*')
  res.setHeader('Access-Control-Allow-Headers', '*')
  res.setHeader('Access-Control-Max-Age', 2592000) // 30 days

  if (req.method === 'OPTIONS') {
    res.writeHead(204)
    res.end()
    return
  }

  if (req.url === '/transaction/raw') {
    res.end(
      JSON.stringify({
        code: 0,
        data: '',
        height: '0',
        log: '',
        success: true,
        txHash: '33B3608EF89CDD64078BD64B2F3DC61AFC3082B9BF638828838D0B0E811EC533'
      })
    )
    return
  }

  if (req.url === '/blockchain/height') {
    res.end(
      JSON.stringify({
        height: '3144128',
        hash: '07d5343f3f5645400c13d9576f13ec2f74511236b5f826951646164485f04ba6',
        spamPowHashFunction: 'sha3_24_rounds',
        spamPowDifficulty: 15,
        spamPowNumberOfPastBlocks: 100,
        spamPowNumberOfTxPerBlock: 2,
        spamPowIncreasingDifficulty: false,
        chainId: 'testnet'
      })
    )
    return
  }

  if (req.url?.includes('api/v2/accounts')) {
    res.end(
      JSON.stringify({
        accounts: {
          edges: [
            {
              node: ACCOUNT_FIXTURE,
              cursor:
                'eyJpZCI6ImIzNDBjMTMwMDk2ODE5NDI4YTYyZTVkZjQwN2ZkNmFiZTY2ZTQ0NGI4OWFkNjRmNjcwYmViOTg2MjFjOWM2NjMifQ=='
            }
          ],
          pageInfo: {
            hasNextPage: false,
            hasPreviousPage: false,
            startCursor:
              'eyJpZCI6ImZkZjBlYzExOGQ5ODM5M2E3NzAyY2Y3MmU0NmZjODdhZDY4MGIxNTJmNjRiMmFhYzU5ZTA5M2FjMmQ2ODhmYmIifQ==',
            endCursor: 'eyJpZCI6IlhZWmFscGhhIn0='
          }
        }
      })
    )
    return
  }

  if (req.url === '/api/v2/markets') {
    res.end(
      JSON.stringify({
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
      })
    )
    return
  }

  if (req.url === '/api/v2/assets') {
    res.end(
      JSON.stringify({
        assets: {
          edges: [
            {
              node: {
                id: 'b340c130096819428a62e5df407fd6abe66e444b89ad64f670beb98621c9c663',
                details: {
                  name: 'tDAI TEST',
                  symbol: 'tDAI',
                  decimals: '5',
                  quantum: '1',
                  erc20: {
                    contractAddress: '0x26223f9C67871CFcEa329975f7BC0C9cB8FBDb9b',
                    lifetimeLimit: '0',
                    withdrawThreshold: '0'
                  }
                },
                status: 'STATUS_ENABLED'
              },
              cursor:
                'eyJpZCI6ImIzNDBjMTMwMDk2ODE5NDI4YTYyZTVkZjQwN2ZkNmFiZTY2ZTQ0NGI4OWFkNjRmNjcwYmViOTg2MjFjOWM2NjMifQ=='
            },
            {
              node: {
                id: 'fc7fd956078fb1fc9db5c19b88f0874c4299b2a7639ad05a47a28c0aef291b55',
                details: {
                  name: 'Vega (fairground)',
                  symbol: 'VEGA',
                  decimals: '18',
                  quantum: '1',
                  erc20: {
                    contractAddress: '0xdf1B0F223cb8c7aB3Ef8469e529fe81E73089BD9',
                    lifetimeLimit: '0',
                    withdrawThreshold: '0'
                  }
                },
                status: 'STATUS_ENABLED'
              },
              cursor:
                'eyJpZCI6ImZjN2ZkOTU2MDc4ZmIxZmM5ZGI1YzE5Yjg4ZjA4NzRjNDI5OWIyYTc2MzlhZDA1YTQ3YTI4YzBhZWYyOTFiNTUifQ=='
            }
          ],
          pageInfo: {
            hasNextPage: false,
            hasPreviousPage: false,
            startCursor:
              'eyJpZCI6ImZkZjBlYzExOGQ5ODM5M2E3NzAyY2Y3MmU0NmZjODdhZDY4MGIxNTJmNjRiMmFhYzU5ZTA5M2FjMmQ2ODhmYmIifQ==',
            endCursor: 'eyJpZCI6IlhZWmFscGhhIn0='
          }
        }
      })
    )
    return
  }

  res.writeHead(404)
  res.end('Not found')
})

const closeServer = () => {
  return new Promise<void>((resolve, reject) => {
    server.close((err) => {
      if (err) {
        reject(err)
      } else {
        resolve()
      }
    })
  })
}

export async function closeServerAndWait() {
  try {
    await closeServer()
  } catch (error) {
    console.error('Error while closing the server:', error)
  }
}
