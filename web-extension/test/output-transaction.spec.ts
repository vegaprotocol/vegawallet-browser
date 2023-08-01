import * as txHelpers from '../backend/tx-helpers.js'
import { TransferRequest } from '@vegaprotocol/protos/dist/vega/TransferRequest'
import { Account } from '@vegaprotocol/protos/dist/vega/Account'
import fs from 'fs'

const bigIntToNumberReplacer = (key: any, value: any) => {
  if (typeof value === 'bigint') {
    if (Number.isSafeInteger(value)) {
      return Number(value)
    } else {
      console.warn('BigInt exceeds the safe integer range. Converting it to a Number may lose precision.')
      return Number(value)
    }
  }
  return value
}

export const solvePoWMock = jest.fn(async () => {
  return 'mocked-pow'
})
jest.mock('../backend/tx-helpers.js', () => {
  const originalModule = jest.requireActual('../backend/tx-helpers.js')
  return {
    ...originalModule,
    solvePoW: solvePoWMock
  }
})

export const KeyPairMock = {
  algorithm: {
    name: 'vega/ed25519',
    version: 1
  },
  index: 'mocked-index',
  publicKey:
    '049d03fe6a7b2fb61bfe2fba4b648f9060b34886a19f86074e6a4a2e0ca14e28da37674e5df70eb4325ebe95d1b80d8cc6c3ac4414b23146e41ebdf601e5a5372',
  secretKey: '1e3b72a0ff4e8990a2eab7c689f4a8f33d380cf1d1bc05c13c5ab85a6b60bebc',
  sign: jest.fn(async () => {
    return '0x650c9f2e6701e3fe73d3054904a9a4bbdb96733f1c4c743ef573ad6ac14c5a3bf8a4731f6e6276faea5247303677fb8dbdf24ff78e53c25052cdca87eecfee85476bcb8a05cb9a1efef7cb87dd68223e117ce800ac46177172544757a487be32f5ab8fe0879fa8add78be465ea8f8d5acf977e9f1ae36d4d47816ea6ed41372b'
  })
}

class NodeRPCMock {
  blockchainHeight() {
    return Promise.resolve({
      spamPowDifficulty: 20,
      hash: '048ed681fbe2334a31c86dcfebd4b55e071273ec460455bff7ebbcdc910f1709',
      height: 758390847
    })
  }

  url = 'http://localhost:9933'
}

export default NodeRPCMock
const writeTransactionToFile = async () => {
  const rpc = new NodeRPCMock()
  // const keyPair = new KeyPair('bil', 'bob', 'ben')
  const account: Account = {
    id: '234234',
    owner: 'bob',
    balance: '45',
    asset: '535',
    marketId: '67',
    type: 5
  }
  console.log('created account')

  const transaction: TransferRequest = {
    fromAccount: [account],
    toAccount: [account],
    amount: '1',
    minAmount: '11',
    asset: 'd1984e3d365faa05bcafbe41f50f90e3663ee7c0da22bb1e24b164e9532691b2',
    type: 15
  }

  console.log('created transaction')
  const tx = await txHelpers.createTransactionData(rpc, KeyPairMock, transaction, 'my sending mode')
  const txObject = {
    transaction: tx.txData,
    inputData: tx.inputDataRaw,
    encodedData: tx.base64Tx
  }

  const txObjectJSON = JSON.stringify(txObject, bigIntToNumberReplacer, 2)

  console.log('transaction =', txObjectJSON)

  try {
    fs.writeFileSync('./transactionjson.json', txObjectJSON)
    console.log('JSON data has been written to the file successfully.')
  } catch (err) {
    console.error('Error writing JSON data to file:', err)
  }
}

describe('encoding and decoding', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })
  it('write transactions to file', async () => {
    await writeTransactionToFile()
  })
})
