import { RawInteraction, InteractionResponse } from '@vegaprotocol/wallet-ui'
import { getRuntime, sendMessageToPages } from '../util'

const runtime = getRuntime()

export const getImplementation = () => {
  return {
    sendMessage: async (message: RawInteraction) => {
      try {
        await sendMessageToPages(message)
      } catch (err) {
        // @TODO: log error
        console.error('Error sending message to popup', err)
      }
    },
    addListener: (handler: (res: InteractionResponse) => void) => {
      runtime.onMessage.addListener((message, sender) => {
        if (sender.id === runtime.id && 'traceID' in message) {
          handler(message)
        }
      })
    },
  }
}
