import { WalletService } from '@vegaprotocol/wallet-service'

type Sender = browser.runtime.MessageSender | chrome.runtime.MessageSender

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const messageHandler =
  (ws: WalletService) => (message: any, sender: Sender) => {
    if (
      sender.id === chrome.runtime.id &&
      message &&
      typeof message === 'object' &&
      'id' in message &&
      'method' in message &&
      'params' in message
    ) {
      if (message.method.startsWith('admin.')) {
        ws.handleAdmin(message.method, message.params)
          .then((response) => {
            chrome.runtime.sendMessage({
              id: message.id,
              data: response,
            })
          })
          .catch((err) => {
            chrome.runtime.sendMessage({
              id: message.id,
              error: err,
            })
          })
      }

      if (message.method.startsWith('client.')) {
        if (sender.url) {
          const source = new URL(sender.url)
          ws.handleClient(message.method, message.params, source.origin)
            .then(async (response) => {
              const tabs = await chrome.tabs.query({
                url: '<all_urls>',
                windowType: 'normal',
              })

              tabs.forEach((tab) => {
                if (typeof tab.id == 'number') {
                  chrome.tabs.sendMessage(tab.id, {
                    id: message.id,
                    data: response,
                  })
                }
              })
            })
            .catch(async (err) => {
              const tabs = await chrome.tabs.query({
                url: '<all_urls>',
                windowType: 'normal',
              })

              tabs.forEach((tab) => {
                if (typeof tab.id == 'number') {
                  chrome.tabs.sendMessage(tab.id, {
                    id: message.id,
                    error: err,
                  })
                }
              })
            })
        }
      }
    }
    return true
  }
