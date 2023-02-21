import { EventEmitter } from 'eventemitter3'
import type {
  InteractionType,
  InteractionResponseType,
  RawInteraction,
  InteractionResponse,
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
  InteractionType,
  InteractionResponseType | null
> = {
  ERROR_OCCURRED: null,
  INTERACTION_SESSION_BEGAN: null,
  INTERACTION_SESSION_ENDED: null,
  LOG: null,
  TRANSACTION_SUCCEEDED: null,
  TRANSACTION_FAILED: null,
  REQUEST_SUCCEEDED: null,
  REQUEST_PERMISSIONS_REVIEW: 'DECISION',
  REQUEST_WALLET_CONNECTION_REVIEW: 'WALLET_CONNECTION_DECISION',
  REQUEST_WALLET_SELECTION: 'SELECTED_WALLET',
  REQUEST_PASSPHRASE: 'ENTERED_PASSPHRASE',
  REQUEST_TRANSACTION_REVIEW_FOR_SENDING: 'DECISION',
}

export type Implementation = {
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

    if (!ResponseMapping[event.name]) {
      this.implementation.sendMessage(event)
      return null
    }

    return new Promise((resolve, reject) => {
      const handler = (message: InteractionResponse) => {
        if (message.name === 'CANCEL_REQUEST') {
          this.implementation.sendMessage({
            traceID,
            name: 'INTERACTION_SESSION_ENDED',
          })
          reject(new EventCancelError())
          return
        }

        if (message.name !== ResponseMapping[event.name]) {
          this.implementation.sendMessage({
            traceID,
            name: 'ERROR_OCCURRED',
            data: {
              name: 'Error',
              error: 'Unexpected response type',
            },
          })
          this.implementation.sendMessage({
            traceID,
            name: 'INTERACTION_SESSION_ENDED',
          })
          reject(new EventIncorrectResponseError())
          return
        }

        resolve(message)
      }

      this.events.once(traceID, handler)
      this.implementation.sendMessage(event)
    })
  }
}
