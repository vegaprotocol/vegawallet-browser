import { RpcMethods } from './client-rpc-methods'
import JSONRPCClient from './json-rpc-client'

export const createWallet = async (mnemonic: string, client: JSONRPCClient) => {
  const walletName = 'Wallet 1'
  await client.request(RpcMethods.ImportWallet, { recoveryPhrase: mnemonic, name: walletName })
  await client.request(RpcMethods.GenerateKey, {
    wallet: walletName,
    name: `Key 1`
  })
}
