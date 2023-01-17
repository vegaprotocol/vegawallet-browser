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
  InteractionResponseEnteredPassphrase,
  InteractionResponseWalletConnectionDecision,
  InteractionResponseSelectedWallet,
} from '@vegaprotocol/wallet-ui'

type Implementation = {
  sendMessage: (interaction: RawInteraction) => void
  addListener: (handler: (message: unknown) => void) => void
}

export class EventBus {
  private events: EventEmitter
  private implementation: Implementation

  constructor(implementation: Implementation) {
    this.implementation = implementation
    this.events = new EventEmitter()

    this.implementation.addListener((message: unknown) => {
      if (message && 'name' in message && 'traceID' in message) {
        const event = message as InteractionResponse
        this.events.emit(event.name, event)
      }
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
    const traceID = uuid()

    this.implementation.sendMessage({
      traceID,
      name,
      data,
    })

    return new Promise((resolve, reject) => {
      const onCancel = () => {
        this.implementation.sendMessage({
          traceID,
          name: INTERACTION_TYPE.ERROR_OCCURRED,
          data: {
            name: 'Error',
            error: 'Cancelled by the user',
          },
        })
        this.implementation.sendMessage({
          traceID,
          name: INTERACTION_TYPE.INTERACTION_SESSION_ENDED,
        })
        this.events.removeListener(
          INTERACTION_RESPONSE_TYPE.CANCEL_REQUEST,
          onCancel
        )
        reject(new Error('Cancelled by the user'))
      }

      const handler = (message: InteractionResponse) => {
        if (message.traceID === traceID) {
          resolve(message as InteractionResponse)
          this.events.removeListener(name, handler)
          this.events.removeListener(
            INTERACTION_RESPONSE_TYPE.CANCEL_REQUEST,
            onCancel
          )
        }
      }

      this.events.addListener(
        INTERACTION_RESPONSE_TYPE.CANCEL_REQUEST,
        onCancel
      )
      this.events.addListener(name, handler)
    })
  }
}
