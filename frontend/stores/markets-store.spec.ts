import { RpcMethods } from '../lib/client-rpc-methods'
import { useMarketsStore } from './markets-store'

const marketsMock = [
  {
    id: '5b05109662e7434fea498c4a1c91d3179b80e9b8950d6106cec60e1f342fc604',
    decimalPlaces: 1,
    positionDecimalPlaces: 4,
    state: 'STATE_ACTIVE',
    tradingMode: 'TRADING_MODE_CONTINUOUS',
    lpPriceRange: '0.8',
    proposal: {
      id: '5b05109662e7434fea498c4a1c91d3179b80e9b8950d6106cec60e1f342fc604',
      rationale: {
        title: 'BTC/USDT-230930',
        description:
          '## Summary\n\nThis proposal requests to list BTC/USDT-230930 as a market with USDT as a settlement asset on the Vega Network as discussed in: https://community.vega.xyz/.\n\n## Rationale\n\n- BTC is the largest Crypto asset with the highest volume and Marketcap.\n- Given the price, 1 decimal places will be used for price due to the number of valid digits in asset price. \n- Position decimal places will be set to 4 considering the value per contract\n- USDT is chosen as settlement asset due to its stability.',
        __typename: 'ProposalRationale'
      },
      __typename: 'Proposal'
    },
    marketTimestamps: {
      open: '2023-06-17T10:12:06.929617602Z',
      close: null,
      __typename: 'MarketTimestamps'
    },
    openingAuction: {
      durationSecs: 534938,
      volume: 0,
      __typename: 'AuctionDuration'
    },
    accountsConnection: {
      edges: [
        {
          node: {
            type: 'ACCOUNT_TYPE_INSURANCE',
            asset: {
              id: 'bf1e88d19db4b3ca0d1d5bdb73718a01686b18cf731ca26adedf3c8b83802bba',
              __typename: 'Asset'
            },
            balance: '356300252',
            __typename: 'AccountBalance'
          },
          __typename: 'AccountEdge'
        },
        {
          node: {
            type: 'ACCOUNT_TYPE_FEES_LIQUIDITY',
            asset: {
              id: 'bf1e88d19db4b3ca0d1d5bdb73718a01686b18cf731ca26adedf3c8b83802bba',
              __typename: 'Asset'
            },
            balance: '7369138',
            __typename: 'AccountBalance'
          },
          __typename: 'AccountEdge'
        }
      ],
      __typename: 'AccountsConnection'
    },
    fees: {
      factors: {
        makerFee: '0.00005',
        infrastructureFee: '0.0003',
        liquidityFee: '0.0001',
        __typename: 'FeeFactors'
      },
      __typename: 'Fees'
    },
    priceMonitoringSettings: {
      parameters: {
        triggers: [
          {
            horizonSecs: 3600,
            probability: 0.9999,
            auctionExtensionSecs: 120,
            __typename: 'PriceMonitoringTrigger'
          },
          {
            horizonSecs: 14400,
            probability: 0.9999,
            auctionExtensionSecs: 180,
            __typename: 'PriceMonitoringTrigger'
          },
          {
            horizonSecs: 43200,
            probability: 0.9999,
            auctionExtensionSecs: 300,
            __typename: 'PriceMonitoringTrigger'
          }
        ],
        __typename: 'PriceMonitoringParameters'
      },
      __typename: 'PriceMonitoringSettings'
    },
    riskFactors: {
      market: '5b05109662e7434fea498c4a1c91d3179b80e9b8950d6106cec60e1f342fc604',
      short: '0.082370599259086',
      long: '0.0763307160598455',
      __typename: 'RiskFactor'
    },
    liquidityMonitoringParameters: {
      triggeringRatio: '0.7',
      targetStakeParameters: {
        timeWindow: 3600,
        scalingFactor: 1,
        __typename: 'TargetStakeParameters'
      },
      __typename: 'LiquidityMonitoringParameters'
    },
    tradableInstrument: {
      instrument: {
        id: '',
        name: 'BTC/USDT expiry 2023 Sept 30th',
        code: 'BTC/USDT-230930',
        metadata: {
          tags: [
            'base:BTC',
            'quote:USDT',
            'class:fx/crypto',
            'quarterly',
            'sector:defi',
            'enactment:2023-06-15T14:00:00Z',
            'settlement:2023-09-30T08:00:00Z'
          ],
          __typename: 'InstrumentMetadata'
        },
        product: {
          quoteName: 'USDT',
          settlementAsset: {
            id: 'bf1e88d19db4b3ca0d1d5bdb73718a01686b18cf731ca26adedf3c8b83802bba',
            symbol: 'USDT',
            name: 'Tether USD',
            decimals: 6,
            __typename: 'Asset'
          },
          dataSourceSpecForSettlementData: {
            id: '99a1551b8cc7b75a3628a768e0772dde4c5a1ddf6c647507079c2e111d614a28',
            data: {
              sourceType: {
                sourceType: {
                  signers: [
                    {
                      signer: {
                        address: '0xfCEAdAFab14d46e20144F48824d0C09B1a03F2BC',
                        __typename: 'ETHAddress'
                      },
                      __typename: 'Signer'
                    }
                  ],
                  __typename: 'DataSourceSpecConfiguration'
                },
                __typename: 'DataSourceDefinitionExternal'
              },
              __typename: 'DataSourceDefinition'
            },
            __typename: 'DataSourceSpec'
          },
          dataSourceSpecForTradingTermination: {
            id: 'b3bf72d42d2938eceea05725949ecd24d7138a3cd7e29056a46b381efcbb4115',
            data: {
              sourceType: {
                sourceType: {
                  conditions: [
                    {
                      operator: 'OPERATOR_GREATER_THAN_OR_EQUAL',
                      value: '1696060800',
                      __typename: 'Condition'
                    }
                  ],
                  __typename: 'DataSourceSpecConfigurationTime'
                },
                __typename: 'DataSourceDefinitionInternal'
              },
              __typename: 'DataSourceDefinition'
            },
            __typename: 'DataSourceSpec'
          },
          dataSourceSpecBinding: {
            settlementDataProperty: 'prices.BTC.value',
            tradingTerminationProperty: 'vegaprotocol.builtin.timestamp',
            __typename: 'DataSourceSpecToFutureBinding'
          },
          __typename: 'Future'
        },
        __typename: 'Instrument'
      },
      riskModel: {
        tau: 0.0001140771161,
        riskAversionParameter: 0.000001,
        params: {
          r: 0,
          sigma: 1.5,
          mu: 0,
          __typename: 'LogNormalModelParams'
        },
        __typename: 'LogNormalRiskModel'
      },
      marginCalculator: {
        scalingFactors: {
          searchLevel: 1.1,
          initialMargin: 1.5,
          collateralRelease: 1.7,
          __typename: 'ScalingFactors'
        },
        __typename: 'MarginCalculator'
      },
      __typename: 'TradableInstrument'
    },
    __typename: 'Market',
    data: {
      market: {
        id: '5b05109662e7434fea498c4a1c91d3179b80e9b8950d6106cec60e1f342fc604',
        __typename: 'Market'
      },
      auctionEnd: null,
      auctionStart: null,
      bestBidPrice: '262273',
      bestBidVolume: '2',
      bestOfferPrice: '262371',
      bestOfferVolume: '1458',
      bestStaticBidPrice: '262273',
      bestStaticBidVolume: '2',
      bestStaticOfferPrice: '262371',
      bestStaticOfferVolume: '1458',
      indicativePrice: '0',
      indicativeVolume: '0',
      marketState: 'STATE_ACTIVE',
      marketTradingMode: 'TRADING_MODE_CONTINUOUS',
      marketValueProxy: '33348753264182',
      markPrice: '262371',
      midPrice: '262322',
      openInterest: '13151',
      priceMonitoringBounds: [
        {
          minValidPrice: '246044',
          maxValidPrice: '278709',
          trigger: {
            horizonSecs: 3600,
            probability: 0.9999,
            auctionExtensionSecs: 120,
            __typename: 'PriceMonitoringTrigger'
          },
          referencePrice: '261901',
          __typename: 'PriceMonitoringBounds'
        },
        {
          minValidPrice: '230630',
          maxValidPrice: '295935',
          trigger: {
            horizonSecs: 14400,
            probability: 0.9999,
            auctionExtensionSecs: 180,
            __typename: 'PriceMonitoringTrigger'
          },
          referencePrice: '261384',
          __typename: 'PriceMonitoringBounds'
        },
        {
          minValidPrice: '208660',
          maxValidPrice: '321355',
          trigger: {
            horizonSecs: 43200,
            probability: 0.9999,
            auctionExtensionSecs: 300,
            __typename: 'PriceMonitoringTrigger'
          },
          referencePrice: '259347',
          __typename: 'PriceMonitoringBounds'
        }
      ],
      staticMidPrice: '262322',
      suppliedStake: '265000000000',
      targetStake: '2845369993',
      trigger: 'AUCTION_TRIGGER_UNSPECIFIED',
      __typename: 'MarketData'
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

  it('sets error state on failure', async () => {
    const failingRequest = async () => {
      throw new Error('Failed to fetch')
    }
    await useMarketsStore.getState().fetchMarkets(failingRequest as unknown as any)
    expect(useMarketsStore.getState().error).toBe('Failed to fetch markets')
  })
})
