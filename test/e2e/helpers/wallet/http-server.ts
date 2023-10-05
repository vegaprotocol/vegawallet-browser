import http from 'node:http'
import { Core, TradingData } from '@vegaprotocol/rest-clients'

const blockHeightObj: Core.v1LastBlockHeightResponse = {
  height: '3144128',
  hash: '07d5343f3f5645400c13d9576f13ec2f74511236b5f826951646164485f04ba6'
}

const rawTransactionObj: Core.v1SubmitRawTransactionResponse = {
  success: true,
  txHash: '33B3608EF89CDD64078BD64B2F3DC61AFC3082B9BF638828838D0B0E811EC533'
}

const tradeableInstrument: TradingData.vegaTradableInstrument = {
  instrument: {
    future: {
      settlementAsset: 'b340c130096819428a62e5df407fd6abe66e444b89ad64f670beb98621c9c663'
    }
  }
}

const market: TradingData.vegaMarket = {
  id: '3ab4fc0ea7e6eabe74133fb14ef2d8934ff21dd894ff080a09ec9a3647ceb2a4',
  decimalPlaces: '5',
  tradableInstrument: tradeableInstrument
  //need settlement asset here
}

const marketEdge: TradingData.v2MarketEdge = {
  node: market
}
const marketConnection: TradingData.v2MarketConnection = {
  edges: [marketEdge]
}

const marketsResponseObj: TradingData.v2ListMarketsResponse = {
  markets: marketConnection
}

const blockHeightResponse = () => JSON.stringify(blockHeightObj)
const rawTransactionResponse = () => JSON.stringify(rawTransactionObj)
const marketsResponse = () => JSON.stringify(marketsResponseObj)

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
    res.end(rawTransactionResponse())
    return
  }

  if (req.url === '/blockchain/height') {
    res.end(blockHeightResponse())
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
    res.end(marketsResponse())
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
