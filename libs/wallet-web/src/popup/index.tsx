import React from 'react'
// import { z } from 'zod'
import { v4 as uuid } from 'uuid'
import { EventEmitter } from 'eventemitter3'
import { createRoot } from 'react-dom/client'
import {
  App as WalletUI,
  InteractionResponse,
  Service,
} from '@vegaprotocol/wallet-ui'
import { service as mock } from '@vegaprotocol/wallet-ui/mocks'
import {
  WalletAdmin,
  WalletAPIHandler,
  WalletAPIRequest,
  WalletAPIResponse,
} from '@vegaprotocol/wallet-admin'
// import { Storage } from '@vegaprotocol/wallet-service'

import './styles.css'

// const AppConfigSchema = z.object({
//   logLevel: z.string(),
//   vegaHome: z.string(),
//   defaultNetwork: z.string(),
//   telemetry: z.object({
//     consentAsked: z.boolean(),
//     enabled: z.boolean(),
//   }).required(),
// }).required()

const serviceBus = new EventEmitter<string, WalletAPIResponse>()
const interactionBus = new EventEmitter<string, InteractionResponse>()

type Engine = {
  storage: typeof chrome.storage.local | typeof browser.storage.local
  runtime: typeof chrome.runtime | typeof browser.runtime
}

const getEngine = (): Engine => {
  if (typeof browser !== 'undefined') {
    return {
      storage: browser.storage.local,
      runtime: browser.runtime,
    }
  }

  if (typeof chrome !== 'undefined') {
    return {
      storage: chrome.storage.local,
      runtime: chrome.runtime,
    }
  }

  throw new Error(
    'Unsupported platform, both "chrome" or "browser" is unavailable in the global namespace.'
  )
}

const { runtime } = getEngine()

// const appConfigStorage = new Storage('app-config', AppConfigSchema, storage)

class MessageBus {
  constructor() {
    runtime.onMessage.addListener((message, sender) => {
      console.log('POPUP-received: ', message, sender)
      if ('id' in message) {
        serviceBus.emit(message.id, message)
      }
      if ('traceID' in message) {
        interactionBus.emit(message.traceID, message)
      }
    })
  }

  emitAdminRequest: WalletAPIHandler = async (event: WalletAPIRequest) => {
    const id = uuid()
    console.log('POPUP-sending: ', event)

    return new Promise((resolve) => {
      serviceBus.once(id, (message) => resolve(message))
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore Platform signatures not compatible
      runtime.sendMessage({ id, ...event })
    })
  }
}

const messageBus = new MessageBus()

const service: Service = {
  ...mock,

  TYPE: 'browser',

  // GetAppConfig: async () => {
  //   const config = await appConfigStorage.get('config') || {
  //     logLevel: '',
  //     vegaHome: '',
  //     defaultNetwork: '',
  //     telemetry: {
  //       consentAsked: false,
  //       enabled: false,
  //     },
  //   }

  //   return config
  // },
  // UpdateAppConfig: async (config) => {
  //   await appConfigStorage.set('config', config)
  //   return
  // },

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
}

const client = new WalletAdmin(messageBus.emitAdminRequest)

const uiruntime = {
  WindowReload: () => window.location.reload(),
}

const container = document.getElementById('app')

if (container) {
  const root = createRoot(container)
  root.render(
    <WalletUI service={service} client={client} runtime={uiruntime} />
  )
}
