import { v4 as uuid } from 'uuid'
import { EventEmitter } from 'events'
import {
  RawInteraction,
  InteractionResponse,
  INTERACTION_TYPE,
  RequestWalletConnectionContent,
  RequestWalletSelectionContent,
  RequestPermissionsContent,
  RequestTransactionReviewContent,
  RequestTransactionSuccessContent,
  RequestTransactionFailureContent,
  RequestPassphraseContent,
  RequestSucceededContent,
  ErrorOccurredContent,
  LogContent,
  INTERACTION_RESPONSE_TYPE,
  InteractionResponseDecision,
  InteractionResponseEnteredPassphrase,
  InteractionResponseWalletConnectionDecision,
  InteractionResponseSelectedWallet,
} from '@vegaprotocol/wallet-ui/src/types'

export type EventData =
  | RequestWalletConnectionContent
  | RequestWalletSelectionContent
  | RequestPermissionsContent
  | RequestTransactionReviewContent
  | RequestTransactionSuccessContent
  | RequestTransactionFailureContent
  | RequestPassphraseContent
  | RequestSucceededContent
  | ErrorOccurredContent
  | LogContent

export type EventResponseData =
  | InteractionResponseDecision['data']
  | InteractionResponseEnteredPassphrase['data']
  | InteractionResponseSelectedWallet['data']
  | InteractionResponseWalletConnectionDecision['data']

export class EventCancelError extends Error {
  constructor() {
    super('Cancelled by the user')
  }
}

export class EventIncorrectResponseError extends Error {
  constructor() {
    super('Incorrect response to interaction event')
  }
}

export const ResponseMapping: Record<
  INTERACTION_TYPE,
  INTERACTION_RESPONSE_TYPE | null
> = {
  [INTERACTION_TYPE.ERROR_OCCURRED]: null,
  [INTERACTION_TYPE.INTERACTION_SESSION_BEGAN]: null,
  [INTERACTION_TYPE.INTERACTION_SESSION_ENDED]: null,
  [INTERACTION_TYPE.LOG]: null,
  [INTERACTION_TYPE.TRANSACTION_SUCCEEDED]: null,
  [INTERACTION_TYPE.TRANSACTION_FAILED]: null,
  [INTERACTION_TYPE.REQUEST_SUCCEEDED]: null,
  [INTERACTION_TYPE.REQUEST_PERMISSIONS_REVIEW]:
    INTERACTION_RESPONSE_TYPE.DECISION,
  [INTERACTION_TYPE.REQUEST_WALLET_CONNECTION_REVIEW]:
    INTERACTION_RESPONSE_TYPE.WALLET_CONNECTION_DECISION,
  [INTERACTION_TYPE.REQUEST_WALLET_SELECTION]:
    INTERACTION_RESPONSE_TYPE.SELECTED_WALLET,
  [INTERACTION_TYPE.REQUEST_PASSPHRASE]:
    INTERACTION_RESPONSE_TYPE.ENTERED_PASSPHRASE,
  [INTERACTION_TYPE.REQUEST_TRANSACTION_REVIEW_FOR_SENDING]:
    INTERACTION_RESPONSE_TYPE.DECISION,
}

type Implementation = {
  sendMessage: (interaction: RawInteraction) => void
  addListener: (handler: (message: InteractionResponse) => void) => void
  getTraceId?: () => string
}

export class EventBus {
  private getTraceId: () => string
  private events: EventEmitter
  private implementation: Implementation

  constructor(implementation: Implementation) {
    this.implementation = implementation
    this.events = new EventEmitter()
    this.getTraceId = implementation.getTraceId || (() => uuid())

    this.implementation.addListener((message) => {
      this.events.emit(message.traceID, message)
    })
  }

  emit(name: INTERACTION_TYPE.INTERACTION_SESSION_BEGAN): Promise<null>

  emit(name: INTERACTION_TYPE.INTERACTION_SESSION_ENDED): Promise<null>

  emit(
    name: INTERACTION_TYPE.REQUEST_WALLET_CONNECTION_REVIEW,
    data: RequestWalletConnectionContent
  ): Promise<InteractionResponseWalletConnectionDecision>

  emit(
    name: INTERACTION_TYPE.REQUEST_WALLET_SELECTION,
    data: RequestWalletSelectionContent
  ): Promise<InteractionResponseSelectedWallet>

  emit(
    name: INTERACTION_TYPE.REQUEST_PERMISSIONS_REVIEW,
    data: RequestPermissionsContent
  ): Promise<InteractionResponse>

  emit(
    name: INTERACTION_TYPE.REQUEST_TRANSACTION_REVIEW_FOR_SENDING,
    data: RequestTransactionReviewContent
  ): Promise<InteractionResponse>

  emit(
    name: INTERACTION_TYPE.TRANSACTION_SUCCEEDED,
    data: RequestTransactionSuccessContent
  ): Promise<InteractionResponse>

  emit(
    name: INTERACTION_TYPE.TRANSACTION_FAILED,
    data: RequestTransactionFailureContent
  ): Promise<InteractionResponse>

  emit(
    name: INTERACTION_TYPE.REQUEST_PASSPHRASE,
    data: RequestPassphraseContent
  ): Promise<InteractionResponseEnteredPassphrase>

  emit(
    name: INTERACTION_TYPE.REQUEST_SUCCEEDED,
    data: RequestSucceededContent
  ): Promise<InteractionResponse>

  emit(
    name: INTERACTION_TYPE.ERROR_OCCURRED,
    data: ErrorOccurredContent
  ): Promise<InteractionResponse>

  emit(
    name: INTERACTION_TYPE.LOG,
    data: LogContent
  ): Promise<InteractionResponse>

  async emit(
    name: INTERACTION_TYPE,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    data?: any
  ): Promise<InteractionResponse | null> {
    const traceID = this.getTraceId()

    return new Promise((resolve, reject) => {
      const handler = (message: InteractionResponse) => {
        if (message.traceID === traceID) {
          if (message.name === INTERACTION_RESPONSE_TYPE.CANCEL_REQUEST) {
            this.implementation.sendMessage({
              traceID,
              name: INTERACTION_TYPE.INTERACTION_SESSION_ENDED,
            })
            reject(new EventCancelError())
            this.events.removeListener(traceID, handler)
            return
          }

          if (message.name !== ResponseMapping[name]) {
            this.implementation.sendMessage({
              traceID,
              name: INTERACTION_TYPE.ERROR_OCCURRED,
              data: {
                name: 'Error',
                error: 'Unexpected response type',
              },
            })
            this.implementation.sendMessage({
              traceID,
              name: INTERACTION_TYPE.INTERACTION_SESSION_ENDED,
            })
            reject(new EventIncorrectResponseError())
            this.events.removeListener(traceID, handler)
            return
          }

          resolve(message)
          this.events.removeListener(traceID, handler)
        }
      }

      this.events.addListener(traceID, handler)

      this.implementation.sendMessage({
        traceID,
        name,
        data,
      })

      if (!ResponseMapping[name]) {
        this.events.removeListener(traceID, handler)
        resolve(null)
      }
    })
  }
}
