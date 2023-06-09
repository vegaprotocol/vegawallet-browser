import * as InputData from '@vegaprotocol/protos/vega/commands/v1/InputData/encode'
import * as Transaction from '@vegaprotocol/protos/vega/commands/v1/Transaction/encode'
import { TX_VERSION_V3 } from '@vegaprotocol/protos/vega/commands/v1/TxVersion'
import { toBase64, toHex } from '@vegaprotocol/crypto/buf'

import solvePoW from './pow.js'

export async function getChainId({ rpc }) {
  const latestBlock = await rpc.blockchainHeight()

  return latestBlock.chainId
}

export async function sendTransaction({ rpc, keys, transaction, sendingMode }) {
  const latestBlock = await rpc.blockchainHeight()
  const pow = await solvePoW({
    difficulty: latestBlock.spamPowDifficulty,
    blockHash: latestBlock.hash,
    tid: latestBlock.hash // TODO: this should be random
  })

  const inputData = InputData.encode({
    blockHeight: BigInt(latestBlock.height),
    nonce: BigInt((Math.random() * Number.MAX_SAFE_INTEGER) >>> 0),
    command: transaction
  })

  const chainId = latestBlock.chainId

  const tx = Transaction.encode({
    inputData,
    signature: {
      value: toHex(await keys.sign(inputData, chainId)),
      algo: keys.algorithm.name,
      version: keys.algorithm.version
    },
    from: {
      pubKey: keys.publicKey.toString()
    },
    version: TX_VERSION_V3,
    pow
  })

  return await rpc.submitRawTransaction(
    toBase64(tx),
    sendingMode
  )
}
