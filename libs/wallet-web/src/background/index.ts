import { WalletService, WalletStore } from '@vegaprotocol/wallet-service'

type Platform = 'chrome' | 'firefox'

const getPlatform = (): Platform => {
  if (typeof browser !== 'undefined') {
    return 'firefox'
  }

  if (typeof chrome !== 'undefined') {
    return 'chrome'
  }

  throw new Error(
    'Unsupported platform, both "chrome" or "browser" is unavailable in the global namespace.'
  )
}

const platform = getPlatform()

const setup = (platform: Platform) => {
  switch (platform) {
    case 'chrome': {
      return setupChrome()
    }
    case 'firefox': {
      return setupFirefox()
    }
  }
}

setup(platform)

function setupChrome() {
  chrome.runtime.onInstalled.addListener(() => {
    console.info('Wallet installed!')

    let popupRef: chrome.windows.Window | undefined

    const ws = new WalletService({
      store: new WalletStore(chrome.storage.local),
      implementation: {
        sendMessage: async (message) => {
          console.log('BG-interaction:send', message)
          // chrome.action.openPopup() not existing (https://github.com/GoogleChrome/developer.chrome.com/issues/2602)

          if (!popupRef && message.name === 'INTERACTION_SESSION_BEGAN') {
            popupRef = await chrome.windows.create({
              url: chrome.runtime.getURL('popup/index.html'),
              type: 'popup',
              top: 0,
              left: 400,
              width: 400,
              height: 600,
            })
          }

          if (popupRef?.id && message.name === 'INTERACTION_SESSION_ENDED') {
            chrome.windows.remove(popupRef.id)
            popupRef = undefined
          }

          try {
            chrome.runtime.sendMessage(message)
          } catch (err) {
            console.error('Error sending message to popup', err)
          }
        },
        addListener: (handler) => {
          chrome.runtime.onMessage.addListener((message, sender) => {
            if (sender.id === chrome.runtime.id && 'traceID' in message) {
              console.log('BG-interaction:receive')
              handler(message)
            }
          })
        },
      },
    })

    chrome.runtime.onMessage.addListener((message, sender) => {
      console.log('BG-received:', message)
      if (
        sender.id === chrome.runtime.id &&
        message &&
        'id' in message &&
        'method' in message &&
        'params' in message
      ) {
        ws.handleAdmin(message.method, message.params)
          .then((response) => {
            console.log('BG-sending: ', response)

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
      return true
    })

    chrome.runtime.onMessageExternal.addListener(
      (message, sender, sendResponse) => {
        console.log('BG-EXT-received: ', message, sender)
        if (
          sender.origin &&
          message &&
          'id' in message &&
          'method' in message &&
          'params' in message
        ) {
          ws.handleClient(message.method, message.params, sender.origin)
            .then((r) => {
              console.log('BG-EXT-sending: ', r)
              sendResponse(r)
            })
            .catch((err) => {
              console.error(err)
            })
        }
        return true
      }
    )
  })
}

function setupFirefox() {
  browser.runtime.onInstalled.addListener(() => {
    console.info('Wallet installed!')
    browser.browserSettings.allowPopupsForUserEvents.set({ value: true })

    const ws = new WalletService({
      store: new WalletStore(browser.storage.local),
      implementation: {
        sendMessage: async (message) => {
          console.log('BG-interaction:send', message)

          // browser.action.
          // const r = await browser.action.openPopup()

          // await browser.sidebarAction.open()
          browser.runtime.sendMessage(message)
        },
        addListener: (handler) => {
          browser.runtime.onMessage.addListener((message, sender) => {
            if (sender.id === browser.runtime.id && 'traceID' in message) {
              console.log('BG-interaction:receive')
              handler(message)
            }
          })
        },
      },
    })

    browser.runtime.onMessage.addListener((message, sender) => {
      console.log('BG-received:', message, sender)
      if (
        sender.id === browser.runtime.id &&
        message &&
        'id' in message &&
        'method' in message &&
        'params' in message
      ) {
        if (message.method.startsWith('admin.')) {
          console.log('BG-admin...')
          ws.handleAdmin(message.method, message.params)
            .then((response) => {
              console.log('BG-sending: ', response)

              browser.runtime.sendMessage({
                id: message.id,
                data: response,
              })
            })
            .catch((err) => {
              browser.runtime.sendMessage({
                id: message.id,
                error: err,
              })
            })
          return true
        }

        if (message.method.startsWith('client.')) {
          if (sender.url) {
            const source = new URL(sender.url)
            console.log('BG-client...')
            ws.handleClient(message.method, message.params, source.origin)
              .then(async (response) => {
                console.log('BG - PROCESSING THE GODDAMN RESPONSE', response)
                const tabs = await browser.tabs.query({
                  url: '<all_urls>',
                  windowType: 'normal',
                })

                tabs.forEach((tab) => {
                  if (typeof tab.id == 'number') {
                    browser.tabs.sendMessage(tab.id, {
                      id: message.id,
                      data: response,
                    })
                  }
                })
              })
              .catch(async (err) => {
                const tabs = await browser.tabs.query({
                  url: '<all_urls>',
                  windowType: 'normal',
                })

                tabs.forEach((tab) => {
                  if (typeof tab.id == 'number') {
                    browser.tabs.sendMessage(tab.id, {
                      id: message.id,
                      error: err,
                    })
                  }
                })
              })
          }
        }
      }

      return false
    })
  })
}
