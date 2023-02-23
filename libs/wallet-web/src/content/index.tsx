import { getRuntime } from '../util'

const runtime = getRuntime()

runtime.onMessage.addListener((message, sender) => {
  if (sender.id === browser.runtime.id) {
    // Receive messages from the background script and send them back to the dApp's runtime
    window.postMessage(message)
  }
})

window.addEventListener('message', (event) => {
  if (runtime.id === event.data?.extensionId) {
    const { extensionId, data } = event.data

    if (data.method === 'client.connect_wallet') {
      // @TODO: display interaction UI
    }

    if (data.method === 'client.sign_transaction') {
      // @TODO: display interaction UI
    }

    // Forward messages to the background script

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore Chrome and FF sendMessage declarations not compatible
    runtime.sendMessage(extensionId, data)
  }
})
