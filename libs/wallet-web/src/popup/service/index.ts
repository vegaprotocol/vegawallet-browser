import { EventEmitter } from 'eventemitter3'
import { InteractionResponse, Service } from '@vegaprotocol/wallet-ui'
import { service as mock } from '@vegaprotocol/wallet-ui/mocks'
import { AppConfigStorage, APP_CONFIG_KEY } from './config'

export const getService = (
  interactionBus: EventEmitter<string, InteractionResponse>
): Service => ({
  ...mock,

  TYPE: 'browser',

  GetAppConfig: () => {
    return AppConfigStorage.get(APP_CONFIG_KEY).then((res) => {
      if (!res || Object.keys(res).length === 0) {
        return {
          logLevel: '',
          vegaHome: '',
          defaultNetwork: '',
          telemetry: {
            consentAsked: false,
            enabled: false,
          },
        }
      }
      return res
    })
  },

  UpdateAppConfig: (config) => {
    return AppConfigStorage.set(APP_CONFIG_KEY, config).then(() => undefined)
  },

  EventsOn: (eventName, handler) => {
    if (eventName === 'new_interaction') {
      interactionBus.addListener(eventName, handler)
    }
  },

  EventsOff: (...events) => {
    events.map((event) => interactionBus.removeListener(event))
  },

  RespondToInteraction: (message) => {
    interactionBus.emit(message.traceID, message)
    return Promise.resolve(undefined)
  },
})
