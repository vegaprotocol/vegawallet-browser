import fs from 'node:fs'
import path from 'node:path'

import { TransferRequest } from '@vegaprotocol/protos/vega/TransferRequest'
import { Account } from '@vegaprotocol/protos/vega/Account'
import { OrderAmendment } from '@vegaprotocol/protos/vega/commands/v1/OrderAmendment.js'
import { RecurringTransfer } from '@vegaprotocol/protos/vega/commands/v1/RecurringTransfer.js'
import { VoteSubmission } from '@vegaprotocol/protos/vega/commands/v1/VoteSubmission.js'
import { WithdrawSubmission } from '@vegaprotocol/protos/vega/commands/v1/WithdrawSubmission.js'
import { TimeInForce } from '@vegaprotocol/protos/vega/Order/TimeInForce.js'
import { DispatchMetric } from '@vegaprotocol/protos/vega/DispatchMetric.js'
import { Value } from '@vegaprotocol/protos/vega/Vote/Value.js'
import { Erc20WithdrawExt } from '@vegaprotocol/protos/vega/Erc20WithdrawExt.js'
import { UndelegateSubmission } from '@vegaprotocol/protos/vega/commands/v1/UndelegateSubmission.js'
import { Method } from '@vegaprotocol/protos/vega/commands/v1/UndelegateSubmission/Method.js'
import { BatchMarketInstructions } from '@vegaprotocol/protos/vega/commands/v1/BatchMarketInstructions.js'
import { OrderCancellation } from '@vegaprotocol/protos/vega/commands/v1/OrderCancellation.js'
import { OrderSubmission } from '@vegaprotocol/protos/vega/commands/v1/OrderSubmission.js'
import { PeggedOrder } from '@vegaprotocol/protos/vega/PeggedOrder.js'
import { IcebergOpts } from '@vegaprotocol/protos/vega/commands/v1/IcebergOpts.js'
import { StopOrdersCancellation } from '@vegaprotocol/protos/vega/commands/v1/StopOrdersCancellation.js'
import { StopOrderSetup } from '@vegaprotocol/protos/vega/commands/v1/StopOrderSetup.js'
import { ExpiryStrategy } from '@vegaprotocol/protos/vega/StopOrder/ExpiryStrategy.js'
import { StopOrdersSubmission } from '@vegaprotocol/protos/vega/commands/v1/StopOrdersSubmission.js'
import { CancelTransfer } from '@vegaprotocol/protos/vega/CancelTransfer.js'
import { DelegateSubmission } from '@vegaprotocol/protos/vega/commands/v1/DelegateSubmission.js'
import { IssueSignatures } from '@vegaprotocol/protos/vega/commands/v1/IssueSignatures.js'
import { NodeSignatureKind } from '@vegaprotocol/protos/vega/commands/v1/NodeSignatureKind.js'
import { LiquidityProvisionAmendment } from '@vegaprotocol/protos/vega/commands/v1/LiquidityProvisionAmendment.js'
import { LiquidityProvisionCancellation } from '@vegaprotocol/protos/vega/commands/v1/LiquidityProvisionCancellation.js'
import { LiquidityProvisionSubmission } from '@vegaprotocol/protos/vega/commands/v1/LiquidityProvisionSubmission.js'
import { OneOffTransfer } from '@vegaprotocol/protos/vega/commands/v1/OneOffTransfer.js'
import { PeggedReference } from '@vegaprotocol/protos/vega/PeggedReference.js'
import { ProposalSubmission } from '@vegaprotocol/protos/vega/commands/v1/ProposalSubmission.js'
import { ProposalTerms } from '@vegaprotocol/protos/vega/ProposalTerms.js'
import { ProposalRationale } from '@vegaprotocol/protos/vega/ProposalRationale.js'
import { Transfer } from '@vegaprotocol/protos/vega/commands/v1/Transfer.js'
import { AccountType } from '@vegaprotocol/protos/vega/AccountType.js'

import * as txHelpers from '../backend/tx-helpers.js'

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

const undelegateSubmission: UndelegateSubmission = {
  nodeId: 'nodeId',
  amount: '1',
  method: Method.METHOD_NOW
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

const proposalTerms: ProposalTerms = {
  closingTimestamp: BigInt(1),
  enactmentTimestamp: BigInt(1),
  validationTimestamp: BigInt(1)
}

const proposalRationale: ProposalRationale = {
  description: 'description',
  title: 'title'
}

const proposalSubmission: ProposalSubmission = {
  reference: 'ref',
  terms: proposalTerms,
  rationale: proposalRationale
}

const orderCancellation: OrderCancellation = {
  orderId: 'orderId',
  marketId: 'marketId'
}

const amendment: OrderAmendment = {
  orderId: 'orderId',
  marketId: 'marketId',
  price: '1',
  sizeDelta: BigInt(1),
  expiresAt: BigInt(1),
  timeInForce: TimeInForce.TIME_IN_FORCE_GTT,
  peggedOffset: '1',
  peggedReference: PeggedReference.PEGGED_REFERENCE_MID
}

const peggedOrder: PeggedOrder = {
  offset: '1',
  reference: PeggedReference.PEGGED_REFERENCE_MID
}

const icebergOpts: IcebergOpts = {
  peakSize: BigInt(1),
  minimumVisibleSize: BigInt(1)
}

const orderSubmission: OrderSubmission = {
  marketId: 'marketId',
  price: '1',
  size: BigInt(1),
  side: 1,
  timeInForce: TimeInForce.TIME_IN_FORCE_GTT,
  expiresAt: BigInt(1),
  type: 1,
  reference: 'reference',
  peggedOrder: peggedOrder,
  icebergOpts: icebergOpts,
  postOnly: false,
  reduceOnly: false
}

const stopOrdersCancellation: StopOrdersCancellation = {
  marketId: 'marketId',
  stopOrderId: 'stopOrderId'
}

const stopOrderSetUp: StopOrderSetup = {
  orderSubmission: orderSubmission,
  expiresAt: BigInt(1),
  expiryStrategy: ExpiryStrategy.EXPIRY_STRATEGY_CANCELS
}

const stopOrdersSubmission: StopOrdersSubmission = {
  risesAbove: stopOrderSetUp,
  fallsBelow: stopOrderSetUp
}

const batchMarketInstructions: BatchMarketInstructions = {
  cancellations: [orderCancellation],
  amendments: [amendment],
  submissions: [orderSubmission],
  stopOrdersCancellation: [stopOrdersCancellation],
  stopOrdersSubmission: [stopOrdersSubmission]
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

const cancelTransfer: CancelTransfer = {
  changes: {
    transferId: 'id'
  }
}

const delegateSubmission: DelegateSubmission = {
  nodeId: 'nodeId',
  amount: '1'
}

const issueSignatures: IssueSignatures = {
  submitter: 'submitter',
  validatorNodeId: 'validatorNodeId',
  kind: NodeSignatureKind.NODE_SIGNATURE_KIND_ASSET_WITHDRAWAL
}

const liquidityProvisionAmendment: LiquidityProvisionAmendment = {
  marketId: 'marketId',
  commitmentAmount: '1',
  fee: '1',
  reference: 'reference',
  sells: [],
  buys: []
}

const liquidityProvisionCancellation: LiquidityProvisionCancellation = {
  marketId: 'marketId'
}

const liquidityProvisionSubmission: LiquidityProvisionSubmission = {
  marketId: 'marketId',
  commitmentAmount: '1',
  fee: '1',
  reference: 'reference',
  sells: [],
  buys: []
}

const transfer: Transfer = {
  amount: '1',
  asset: 'asset',
  to: 'to',
  fromAccountType: AccountType.ACCOUNT_TYPE_BOND,
  toAccountType: AccountType.ACCOUNT_TYPE_BOND,
  reference: 'reference'
}

const oneOffTransfer: OneOffTransfer = {
  deliverOn: BigInt(1)
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

const transactionList: { transaction: any; transactionType: string }[] = [
  { transaction: batchMarketInstructions, transactionType: 'BatchMarketInstructions' },
  { transaction: cancelTransfer, transactionType: 'CancelTransfer' },
  { transaction: delegateSubmission, transactionType: 'DelegateSubmission' },
  { transaction: issueSignatures, transactionType: 'IssueSignatures' },
  { transaction: liquidityProvisionAmendment, transactionType: 'LiquidityProvisionAmendment' },
  { transaction: liquidityProvisionCancellation, transactionType: 'LiquidityProvisionCancellation' },
  { transaction: liquidityProvisionSubmission, transactionType: 'LiquidityProvisionSubmission' },
  { transaction: oneOffTransfer, transactionType: 'OneOffTransfer' },
  { transaction: orderAmendment, transactionType: 'OrderAmendment' },
  { transaction: orderCancellation, transactionType: 'OrderCancellation' },
  { transaction: orderSubmission, transactionType: 'OrderSubmission' },
  { transaction: proposalSubmission, transactionType: 'ProposalSubmission' },
  { transaction: recurringTransfer, transactionType: 'RecurringTransfer' },
  { transaction: transfer, transactionType: 'Transfer' },
  { transaction: transferRequest, transactionType: 'TransferRequest' },
  { transaction: undelegateSubmission, transactionType: 'UndelegateSubmission' },
  { transaction: voteSubmission, transactionType: 'VoteSubmission' },
  { transaction: withdrawSubmission, transactionType: 'WithdrawSubmission' }
]

describe('encoding and decoding', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })
  it('write transfer request to file', async () => {
    for (const { transaction, transactionType } of transactionList) {
      const fileName = `./request-files/${transactionType}.txt`
      await writeTransactionToFile(transaction, fileName)
    }
  })
})

const writeTransactionToFile = async (transaction: any, filePath: string) => {
  const rpc = new NodeRPCMock()
  const tx = await txHelpers.createTransactionData({ rpc: rpc, keys: KeyPairMock, transaction: transaction })

  try {
    const directoryPath = path.dirname(filePath)

    if (!fs.existsSync(directoryPath)) {
      fs.mkdirSync(directoryPath, { recursive: true })
    }

    fs.writeFileSync(filePath, tx.base64Tx)
    console.log(`JSON data has been written to ${filePath}`)
  } catch (err) {
    console.error('Error writing JSON data to file:', err)
  }
}
