import NodeRPC from '../backend/node-rpc.js'
import * as txHelpers from '../backend/tx-helpers.js'
import { TransferRequest } from '@vegaprotocol/protos/dist/vega/TransferRequest'
import { Account } from '@vegaprotocol/protos/dist/vega/Account'

class NodeRPCMock {
  // Mock the getBlockchainHeight method
  blockchainHeight() {
    // Return a dummy value for testing purposes
    return Promise.resolve(1000) // Replace 1000 with your desired dummy value
  }

  url = 'http://localhost:9933'
  // You can also mock other methods used in your code if needed
}

export default NodeRPCMock
const writeTransactionToFile = async () => {
  const rpc = new NodeRPCMock()
  // const keyPair = new KeyPair('bil', 'bob', 'ben')
  const account: Account = {
    id: '',
    owner: '',
    balance: '',
    asset: '',
    marketId: '',
    type: 5
  }
  console.log('created account')

  const transaction: TransferRequest = {
    fromAccount: [account],
    toAccount: [account],
    amount: '1',
    minAmount: '11',
    asset: '1',
    type: 15
  }

  console.log('created transaction')
  const transactionData = await txHelpers.createTransactionData(rpc, '', transaction, 'my sending mode')
  console.log('transaction =', transactionData)
}

describe('encoding and decoding', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })
  it('write transactions to file', async () => {
    writeTransactionToFile()
  })
})
