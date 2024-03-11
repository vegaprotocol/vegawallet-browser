import { SendMessage } from '@/contexts/json-rpc/json-rpc-provider'
import { clearMnemonic } from '@/hooks/suggest-mnemonic'

import { RpcMethods } from './client-rpc-methods'

export const WALLET_NAME = 'Wallet 1'

export const createWallet = async (mnemonic: string, request: SendMessage, propagateError = false) => {
  await request(RpcMethods.ImportWallet, { recoveryPhrase: mnemonic, name: WALLET_NAME }, propagateError)
  await request(
    RpcMethods.GenerateKey,
    {
      wallet: WALLET_NAME,
      name: `Key 0`
    },
    propagateError
  )
  await request(
    RpcMethods.GenerateKey,
    {
      wallet: WALLET_NAME,
      name: `Key 1`
    },
    propagateError
  )
  // Ensure that the mnemonic has been cleared from memory if the wallet was created successfully
  await clearMnemonic()
}
