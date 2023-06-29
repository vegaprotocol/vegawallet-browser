import { SendMessage } from '../contexts/json-rpc/json-rpc-provider'
import { RpcMethods } from './client-rpc-methods'

export const createWallet = async (mnemonic: string, request: SendMessage) => {
  const walletName = 'Wallet 1'
  await request(RpcMethods.ImportWallet, { recoveryPhrase: mnemonic, name: walletName })
  await request(RpcMethods.GenerateKey, {
    wallet: walletName,
    name: `Key 1`
  })
}
