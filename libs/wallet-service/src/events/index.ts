import { EventEmitter } from 'events'
import {
  RawInteraction,
  InteractionResponse,
  INTERACTION_TYPE,
  INTERACTION_RESPONSE_TYPE,
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
  SessionStarted,
  SessionEnded,
  RequestWalletConnection,
  RequestWalletSelection,
  RequestPermissions,
  RequestTransactionReview,
  RequestTransactionSuccess,
  RequestTransactionFailure,
  RequestPassphrase,
  RequestSucceeded,
  ErrorOccurred,
  Log,
  InteractionResponseDecision,
  InteractionResponseEnteredPassphrase,
  InteractionResponseWalletConnectionDecision,
  InteractionResponseSelectedWallet,
} from '@vegaprotocol/wallet-ui'

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
}

export class EventBus {
  private events: EventEmitter
  private implementation: Implementation

  constructor(implementation: Implementation) {
    this.implementation = implementation
    this.events = new EventEmitter()

    this.implementation.addListener((message) => {
      this.events.emit(message.traceID, message)
    })
  }

  async emit(event: SessionStarted): Promise<null>
  async emit(event: SessionEnded): Promise<null>
  async emit(
    event: RequestWalletConnection
  ): Promise<InteractionResponseWalletConnectionDecision>
  async emit(
    event: RequestWalletSelection
  ): Promise<InteractionResponseSelectedWallet>
  async emit(event: RequestPermissions): Promise<InteractionResponseDecision>
  async emit(
    event: RequestTransactionReview
  ): Promise<InteractionResponseDecision>
  async emit(event: RequestTransactionSuccess): Promise<null>
  async emit(event: RequestTransactionFailure): Promise<null>
  async emit(
    event: RequestPassphrase
  ): Promise<InteractionResponseEnteredPassphrase>
  async emit(event: RequestSucceeded): Promise<null>
  async emit(event: ErrorOccurred): Promise<null>
  async emit(event: Log): Promise<null>

  async emit(event: RawInteraction): Promise<InteractionResponse | null> {
    const traceID = event?.traceID

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

          if (message.name !== ResponseMapping[event.name]) {
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

      this.implementation.sendMessage(event)

      if (!ResponseMapping[event.name]) {
        this.events.removeListener(traceID, handler)
        resolve(null)
      }
    })
  }
}
