/* istanbul ignore file */
import { RpcMethods } from '../lib/client-rpc-methods'
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

  const pushMessage = (message: any) => {
    // Set timeout to simulate async
    setTimeout(() => {
      listeners.map((fn) => fn(message))
    }, 50)
  }
  // @ts-ignore
  global.browser = {
    runtime: {
      connect: () => ({
        postMessage: (message: any) => {
          if (message.method === RpcMethods.ListWallets) {
            pushMessage({
              jsonrpc: '2.0',
              result: { wallets },
              id: message.id
            })
          } else if (message.method === RpcMethods.ListKeys) {
            pushMessage({
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
          } else if (message.method === RpcMethods.CreatePassphrase) {
            pushMessage({
              jsonrpc: '2.0',
              result: null,
              id: message.id
            })
          } else if (message.method === RpcMethods.GenerateRecoveryPhrase) {
            pushMessage({
              jsonrpc: '2.0',
              result: { recoveryPhrase: 'Word '.repeat(24) },
              id: message.id
            })
          } else if (message.method === RpcMethods.ImportWallet) {
            pushMessage({
              jsonrpc: '2.0',
              result: null,
              id: message.id
            })
          } else if (message.method === RpcMethods.Lock) {
            pushMessage({
              jsonrpc: '2.0',
              result: null,
              id: message.id
            })
          } else if (message.method === RpcMethods.GenerateKey) {
            pushMessage({
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
          } else if (message.method === RpcMethods.AppGlobals) {
            pushMessage({
              jsonrpc: '2.0',
              result: globals,
              id: message.id
            })
          } else if (message.method === 'admin.unlock') {
            if (message.params.passphrase === 'passphrase') {
              pushMessage({
                jsonrpc: '2.0',
                result: null,
                id: message.id
              })
            } else {
              pushMessage({
                jsonrpc: '2.0',
                error: { code: 1, message: 'Invalid passphrase or corrupted storage' },
                id: message.id
              })
            }
          } else if (message.method === RpcMethods.OpenPopout) {
            listeners.map((fn) =>
              fn({
                jsonrpc: '2.0',
                result: null,
                id: message.id
              })
            )
          } else if (message.method === RpcMethods.ListConnections) {
            listeners[0]({
              jsonrpc: '2.0',
              id: message.id,
              result: {
                connections: [
                  {
                    allowList: {
                      publicKeys: [],
                      wallets: ['Wallet 1']
                    },
                    origin: 'https://vega.xyz'
                  },
                  {
                    allowList: {
                      publicKeys: [],
                      wallets: ['Wallet 1']
                    },
                    origin: 'foo.com'
                  }
                ]
              }
            })
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
        },
        onDisconnect: {
          addListener: (fn: any) => {}
        }
      })
    }
  }
}
