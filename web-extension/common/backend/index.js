import * as InputData from '@vegaprotocol/protos/dist/vega/commands/v1/InputData/encode.js'
import * as Transaction from '@vegaprotocol/protos/dist/vega/commands/v1/Transaction/encode.js'
import { TX_VERSION_V3 } from '@vegaprotocol/protos/dist/vega/commands/v1/TxVersion.js'

import solvePoW from './pow.js'

export async function getChainId ({ rpc }) {
  const latestBlock = await rpc.blockchainHeight()

  return latestBlock.chainId
}

export async function sendTransaction ({ rpc, keys, transaction, sendingMode }) {
  const latestBlock = await rpc.blockchainHeight()
  const pow = await solvePoW({
    difficulty: latestBlock.spamPowDifficulty,
    blockHash: latestBlock.hash,
    tid: latestBlock.hash // TODO: this should be random
  })

  const inputData = InputData.encode({
    blockHeight: BigInt(latestBlock.height),
    nonce: BigInt(Math.random() * Number.MAX_SAFE_INTEGER >>> 0),
    command: transaction
  })

  const chainId = latestBlock.chainId

  const tx = Transaction.encode({
    inputData,
    signature: {
      value: Buffer.from(await keys.sign(inputData, chainId)).toString('hex'),
      algo: keys.algorithm.name,
      version: keys.algorithm.version
    },
    from: {
      pubKey: keys.publicKey.toString()
    },
    version: TX_VERSION_V3,
    pow
  })

  return await rpc.submitRawTransaction(Buffer.from(tx).toString('base64'), sendingMode)
}
