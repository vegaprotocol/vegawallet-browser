/* istanbul ignore file */

// TODO We are getting to the point where a dumb mock client is not good enough
// need to investigate a better mocking solution]

import { RpcMethods } from '../lib/client-rpc-methods'
import { AppGlobals } from '../stores/globals'
import { Key } from '../stores/wallets'

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
  globals?: Partial<AppGlobals>
) => {
  const listeners: Function[] = []

  const pushMessage = (message: any) => {
    // Set timeout to simulate async
    setTimeout(() => {
      // TODO this is a hack
      listeners[0](message)
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
              result: {
                ...defaultGlobals,
                ...globals
              },
              id: message.id
            })
          } else if (message.method === RpcMethods.Unlock) {
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
            pushMessage({
              jsonrpc: '2.0',
              result: null,
              id: message.id
            })
          } else if (message.method === RpcMethods.ListConnections) {
            pushMessage({
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
          } else if (message.method === RpcMethods.UpdateSettings) {
            // TODO this is a hack. We are getting to the point where a dumb mock client is not good enough
            // need to investigate a better mocking solution]
            globals = {
              ...defaultGlobals,
              ...globals,
              settings: message.params
            }
            listeners.map((fn) =>
              fn({
                jsonrpc: '2.0',
                result: null,
                id: message.id
              })
            )
          } else {
            pushMessage({
              jsonrpc: '2.0',
              error: { code: -32601, message: 'Method not found' },
              id: message.id
            })
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
