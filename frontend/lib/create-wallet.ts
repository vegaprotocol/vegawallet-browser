import { SendMessage } from '../contexts/json-rpc/json-rpc-provider'
import { clearMnemonic } from '../hooks/suggest-mnemonic'
import { RpcMethods } from './client-rpc-methods'

export const createWallet = async (mnemonic: string, request: SendMessage, propagateError = false) => {
  const walletName = 'Wallet 1'
  await request(RpcMethods.ImportWallet, { recoveryPhrase: mnemonic, name: walletName }, propagateError)
  await request(
    RpcMethods.GenerateKey,
    {
      wallet: walletName,
      name: `Key 1`
    },
    propagateError
  )
  // Ensure that the mnemonic has been cleared from memory if the wallet was created successfully
  await clearMnemonic()
}
