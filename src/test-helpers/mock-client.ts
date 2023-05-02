/* istanbul ignore file */
export const mockClient = () => {
  const listeners: Function[] = []
  // @ts-ignore
  global.browser = {
    runtime: {
      connect: () => ({
        postMessage: (message: any) => {
          if (message.method === 'admin.list_wallets') {
            listeners.map((fn) =>
              fn({
                jsonrpc: '2.0',
                result: { wallets: ['wallet 1'] },
                id: message.id
              })
            )
          } else if (message.method === 'admin.list_keys') {
            listeners.map((fn) =>
              fn({
                jsonrpc: '2.0',
                result: {
                  keys: [
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
                },
                id: message.id
              })
            )
          } else if (message.method === 'admin.create_passphrase') {
            listeners.map((fn) =>
              fn({
                jsonrpc: '2.0',
                result: null,
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
