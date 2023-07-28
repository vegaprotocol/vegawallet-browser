import * as InputData from '@vegaprotocol/protos/vega/commands/v1/InputData/encode'
import * as Transaction from '@vegaprotocol/protos/vega/commands/v1/Transaction/encode'
import { TX_VERSION_V3 } from '@vegaprotocol/protos/vega/commands/v1/TxVersion'
import { toBase64, toHex } from '@vegaprotocol/crypto/buf'
import { randomFill } from '@vegaprotocol/crypto/crypto'

import solvePoW from './pow.js'

export async function getChainId({ rpc }) {
  const latestBlock = await rpc.blockchainHeight()

  return latestBlock.chainId
}

export async function createTransactionData(rpc, keys, transaction, sendingMode) {
  const latestBlock = await rpc.blockchainHeight()
  const tid = toHex(await randomFill(new Uint8Array(32)))

  console.log('here is your transaction', transaction)
  const pow = await solvePoW({
    difficulty: latestBlock.spamPowDifficulty,
    blockHash: latestBlock.hash,
    tid
  })

  const nonce = new DataView(await randomFill(new Uint8Array(8)).buffer).getBigUint64(0, false)

  const inputDataRaw = {
    blockHeight: BigInt(latestBlock.height),
    nonce,
    command: transaction
  }
  const inputData = InputData.encode(inputDataRaw)

  console.log('inputData', inputData)

  const chainId = latestBlock.chainId

  const txData = {
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
  }

  console.log('txData before encoding', txData)
  //write the transaction json out to a file
  const encodedTx = Transaction.encode(txData)
  // write the encoded json out to a file

  const base64Tx = toBase64(encodedTx)
  console.log('encodedTx', encodedTx)
  return {
    base64Tx, txData, inputData, pow, tid
  }
}
export async function sendTransaction({ rpc, keys, transaction, sendingMode }) {
  const trans = await createTransactionData(rpc, keys, transaction, sendingMode )

  console.log('txData after encoding', trans.txData)
  const txJSON = {
    inputData: toBase64(trans.inputData),
    signature: {
      value: trans.txData.signature.value,
      algo: trans.txData.signature.algo,
      version: trans.txData.signature.version
    },
    from: {
      pubKey: trans.txData.from.pubKey
    },
    version: trans.txData.version,
    pow: {
      tid: toHex(trans.tid),
      nonce: trans.pow.nonce.toString()
    }
  }
  console.log('txJSON', txJSON)

  const base64Tx = toBase64(trans.encodedTx)
  const sentAt = new Date().toISOString()
  const res = await rpc.submitRawTransaction(
    base64Tx,
    sendingMode
  )
  console.log(res, 'res')

  return {
    sentAt,
    transactionHash: res.txHash,
    transaction: txJSON, 
  }
}
