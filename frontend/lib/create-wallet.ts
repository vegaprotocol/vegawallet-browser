import JSONRPCClient from '../../lib/json-rpc-client'
import { RpcMethods } from './client-rpc-methods'

export const createWallet = async (mnemonic: string, client: JSONRPCClient) => {
  const walletName = 'Wallet 1'
  await client.request(RpcMethods.ImportWallet, { recoveryPhrase: mnemonic, name: walletName })
  await client.request(RpcMethods.GenerateKey, {
    wallet: walletName,
    name: `Key 1`
  })
}
