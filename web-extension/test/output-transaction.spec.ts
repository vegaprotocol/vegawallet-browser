import * as txHelpers from '../backend/tx-helpers.js'
import { TransferRequest } from '@vegaprotocol/protos/dist/vega/TransferRequest'
import { Account } from '@vegaprotocol/protos/dist/vega/Account'
import fs from 'fs'
import path from 'path'
import { OrderAmendment } from '@vegaprotocol/protos/dist/vega/commands/v1/OrderAmendment.js'
import { RecurringTransfer } from '@vegaprotocol/protos/dist/vega/commands/v1/RecurringTransfer.js'
import { VoteSubmission } from '@vegaprotocol/protos/dist/vega/commands/v1/VoteSubmission.js'
import { WithdrawSubmission } from '@vegaprotocol/protos/dist/vega/commands/v1/WithdrawSubmission.js'
import { TimeInForce } from '@vegaprotocol/protos/dist/vega/Order/TimeInForce.js'
import { PeggedReference } from '@vegaprotocol/protos/dist/vega/PeggedReference.js'
import { DispatchMetric } from '@vegaprotocol/protos/dist/vega/DispatchMetric.js'
import { WithdrawExt } from '@vegaprotocol/protos/dist/vega/WithdrawExt.js'
import { Value } from '@vegaprotocol/protos/dist/vega/Vote/Value.js'
import { Erc20WithdrawExt } from '@vegaprotocol/protos/dist/vega/Erc20WithdrawExt.js'
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

const account: Account = {
  id: '234234',
  owner: 'bob',
  balance: '45',
  asset: '535',
  marketId: '67',
  type: 5
}

const ecr20: Erc20WithdrawExt = {
  receiverAddress: 'receiverAddress'
}

const transferRequest: TransferRequest = {
  fromAccount: [account],
  toAccount: [account],
  amount: '1',
  minAmount: '11',
  asset: 'd1984e3d365faa05bcafbe41f50f90e3663ee7c0da22bb1e24b164e9532691b2',
  type: 15
}

const orderAmendment: OrderAmendment = {
  orderId: '234234',
  marketId: '234234',
  price: '1',
  sizeDelta: BigInt(1),
  expiresAt: BigInt(1),
  timeInForce: TimeInForce.TIME_IN_FORCE_GTT,
  peggedOffset: '1',
  peggedReference: PeggedReference.PEGGED_REFERENCE_MID
}

const recurringTransfer: RecurringTransfer = {
  startEpoch: BigInt(1),
  endEpoch: BigInt(1),
  factor: 'factor',
  dispatchStrategy: {
    assetForMetric: '',
    metric: DispatchMetric.DISPATCH_METRIC_LP_FEES_RECEIVED,
    markets: []
  }
}

const voteSubmission: VoteSubmission = {
  proposalId: 'proposalId',
  value: Value.VALUE_YES
}

const withdrawSubmission: WithdrawSubmission = {
  amount: '',
  asset: '',
  ext: {
    ext: {
      erc20: ecr20
    }
  }
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

export default NodeRPCMock

const writeTransactionToFile = async (transaction: any, filePath: string) => {
  const rpc = new NodeRPCMock()

  const tx = await txHelpers.createTransactionData({ rpc: rpc, keys: KeyPairMock, transaction: transaction })

  console.log('base64 encoded data: ', tx.base64Tx)

  try {
    const directoryPath = path.dirname(filePath)

    // Create the directory if it doesn't exist
    if (!fs.existsSync(directoryPath)) {
      fs.mkdirSync(directoryPath, { recursive: true })
    }

    fs.writeFileSync(filePath, tx.base64Tx)
    console.log('JSON data has been written to the file successfully.')
  } catch (err) {
    console.error('Error writing JSON data to file:', err)
  }
}

const transactionList: { transaction: any; transactionType: string }[] = [
  { transaction: transferRequest, transactionType: 'TransferRequest' },
  { transaction: orderAmendment, transactionType: 'OrderAmendment' },
  { transaction: recurringTransfer, transactionType: 'RecurringTransfer' },
  { transaction: voteSubmission, transactionType: 'VoteSubmission' },
  { transaction: withdrawSubmission, transactionType: 'WithdrawSubmission' }
]

describe('encoding and decoding', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })
  it('write transfer request to file', async () => {
    for (const { transaction, transactionType } of transactionList) {
      const fileName = `./requestfiles/${transactionType}.txt`
      await writeTransactionToFile(transaction, fileName)
    }
  })
})
