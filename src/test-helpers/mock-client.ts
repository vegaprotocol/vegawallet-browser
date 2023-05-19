/* istanbul ignore file */
import { RpcMethods } from '../lib/rpc-methods'
import { Key } from '../routes/auth/wallets/store'
import { AppGlobals } from '../routes/home/store'

const defaultWallets = ['wallet 1']
const defaultKeys = [
  {
    publicKey: '07248acbd899061ba9c5f3ab47791df2045c8e249f1805a04c2a943160533673',
    name: 'Key 1',
    index: 0,
    metadata: [
      {
        key: 'name',
        value: 'key 1'
      }
    ]
  }
]
const defaultGlobals = {
  passphrase: true,
  wallet: true,
  version: '0.0.1',
  locked: false,
  settings: {
    telemetry: false
  }
}

export const mockClient = (
  wallets: string[] = defaultWallets,
  keys: Key[] = defaultKeys,
  globals: AppGlobals = defaultGlobals
) => {
  const listeners: Function[] = []
  // @ts-ignore
  global.browser = {
    runtime: {
      connect: () => ({
        postMessage: (message: any) => {
          if (message.method === RpcMethods.ListWallets) {
            listeners.map((fn) =>
              fn({
                jsonrpc: '2.0',
                result: { wallets },
                id: message.id
              })
            )
          } else if (message.method === RpcMethods.ListKeys) {
            listeners.map((fn) =>
              fn({
                jsonrpc: '2.0',
                result: {
                  keys: [
                    {
                      publicKey: '07248acbd899061ba9c5f3ab47791df2045c8e249f1805a04c2a943160533673',
                      name: 'Key 1'
                    }
                  ]
                },
                id: message.id
              })
            )
          } else if (message.method === RpcMethods.CreatePassphrase) {
            listeners.map((fn) =>
              fn({
                jsonrpc: '2.0',
                result: null,
                id: message.id
              })
            )
          } else if (message.method === RpcMethods.GenerateRecoveryPhrase) {
            listeners.map((fn) =>
              fn({
                jsonrpc: '2.0',
                result: { recoveryPhrase: 'Word '.repeat(24) },
                id: message.id
              })
            )
          } else if (message.method === RpcMethods.ImportWallet) {
            listeners.map((fn) =>
              fn({
                jsonrpc: '2.0',
                result: null,
                id: message.id
              })
            )
          } else if (message.method === RpcMethods.GenerateKey) {
            listeners.map((fn) =>
              fn({
                jsonrpc: '2.0',
                result: {
                  publicKey: '17248acbd899061ba9c5f3ab47791df2045c8e249f1805a04c2a943160533673',
                  name: 'Key 2',
                  index: 0,
                  metadata: [
                    {
                      key: 'name',
                      value: 'key 2'
                    }
                  ]
                },
                id: message.id
              })
            )
          } else if (message.method === RpcMethods.AppGlobals) {
            listeners.map((fn) =>
              fn({
                jsonrpc: '2.0',
                result: globals,
                id: message.id
              })
            )
          } else {
            throw new Error('Message not handled')
          }
        },
        onmessage: (...args: any[]) => {
          console.log('om', args)
        },
        onMessage: {
          addListener: (fn: any) => {
            listeners.push(fn)
          }
        }
      })
    }
  }
}
