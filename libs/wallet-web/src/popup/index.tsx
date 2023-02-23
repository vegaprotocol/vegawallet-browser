import React from 'react'
import { v4 as uuid } from 'uuid'
import { EventEmitter } from 'eventemitter3'
import { createRoot } from 'react-dom/client'
import { App as WalletUI, InteractionResponse } from '@vegaprotocol/wallet-ui'
import {
  WalletAdmin,
  WalletAPIHandler,
  WalletAPIRequest,
  WalletAPIResponse,
} from '@vegaprotocol/wallet-admin'
import { getService } from './service'
import { getRuntime } from './runtime'
import { getRuntime as getPopupRuntime } from '../util'

import './styles.css'

const serviceBus = new EventEmitter<string, WalletAPIResponse>()
const interactionBus = new EventEmitter<string, InteractionResponse>()

const popupRuntime = getPopupRuntime()

class MessageBus {
  constructor() {
    popupRuntime.onMessage.addListener((message) => {
      if ('id' in message) {
        serviceBus.emit(message.id, message.data)
      }
      if ('traceID' in message) {
        interactionBus.emit(message.traceID, message.data)
      }
    })
  }

  emitAdminRequest: WalletAPIHandler = async (event: WalletAPIRequest) => {
    const id = uuid()
    return new Promise((resolve) => {
      serviceBus.once(id, (message) => resolve(message))
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore Platform signatures not compatible
      popupRuntime.sendMessage({ id, ...event })
    })
  }
}

const messageBus = new MessageBus()

const client = new WalletAdmin(messageBus.emitAdminRequest)
const service = getService(interactionBus)
const runtime = getRuntime()

const container = document.getElementById('app')

if (container) {
  const root = createRoot(container)
  root.render(<WalletUI service={service} client={client} runtime={runtime} />)
}
