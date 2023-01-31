import {
  RawInteraction,
  InteractionResponse,
  INTERACTION_TYPE,
  INTERACTION_RESPONSE_TYPE,
  CONNECTION_RESPONSE,
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
import { EventBus } from '../src/events'

// eslint-disable-next-line @typescript-eslint/no-empty-function
const noop = () => {}

export class MockEventBus extends EventBus {
  constructor() {
    super({
      sendMessage: noop,
      addListener: noop,
    })
  }

  override async emit(event: SessionStarted): Promise<null>
  override async emit(event: SessionEnded): Promise<null>
  override async emit(
    event: RequestWalletConnection
  ): Promise<InteractionResponseWalletConnectionDecision>
  override async emit(
    event: RequestWalletSelection
  ): Promise<InteractionResponseSelectedWallet>
  override async emit(
    event: RequestPermissions
  ): Promise<InteractionResponseDecision>
  override async emit(
    event: RequestTransactionReview
  ): Promise<InteractionResponseDecision>
  override async emit(event: RequestTransactionSuccess): Promise<null>
  override async emit(event: RequestTransactionFailure): Promise<null>
  override async emit(
    event: RequestPassphrase
  ): Promise<InteractionResponseEnteredPassphrase>
  override async emit(event: RequestSucceeded): Promise<null>
  override async emit(event: ErrorOccurred): Promise<null>
  override async emit(event: Log): Promise<null>

  override async emit(
    event: RawInteraction
  ): Promise<InteractionResponse | null> {
    switch (event.name) {
      case INTERACTION_TYPE.INTERACTION_SESSION_BEGAN:
        return Promise.resolve(null)
      case INTERACTION_TYPE.INTERACTION_SESSION_ENDED:
        return Promise.resolve(null)
      case INTERACTION_TYPE.REQUEST_WALLET_CONNECTION_REVIEW:
        return Promise.resolve({
          traceID: event.traceID,
          name: INTERACTION_RESPONSE_TYPE.WALLET_CONNECTION_DECISION,
          data: {
            connectionApproval: CONNECTION_RESPONSE.APPROVED_ONCE,
          },
        })
      case INTERACTION_TYPE.REQUEST_WALLET_SELECTION:
        return Promise.resolve({
          traceID: event.traceID,
          name: INTERACTION_RESPONSE_TYPE.SELECTED_WALLET,
          data: {
            wallet: 'test',
            passphrase: '123',
          },
        })
      case INTERACTION_TYPE.REQUEST_PERMISSIONS_REVIEW:
        return Promise.resolve({
          traceID: event.traceID,
          name: INTERACTION_RESPONSE_TYPE.DECISION,
          data: {
            approved: true,
          },
        })
      case INTERACTION_TYPE.REQUEST_TRANSACTION_REVIEW_FOR_SENDING:
        return Promise.resolve({
          traceID: event.traceID,
          name: INTERACTION_RESPONSE_TYPE.DECISION,
          data: {
            approved: true,
          },
        })
      case INTERACTION_TYPE.TRANSACTION_SUCCEEDED:
        return Promise.resolve(null)
      case INTERACTION_TYPE.TRANSACTION_FAILED:
        return Promise.resolve(null)
      case INTERACTION_TYPE.REQUEST_PASSPHRASE:
        return Promise.resolve({
          traceID: event.traceID,
          name: INTERACTION_RESPONSE_TYPE.ENTERED_PASSPHRASE,
          data: {
            passphrase: '123',
          },
        })
      case INTERACTION_TYPE.REQUEST_SUCCEEDED:
        return Promise.resolve(null)
      case INTERACTION_TYPE.ERROR_OCCURRED:
        return Promise.resolve(null)
      case INTERACTION_TYPE.LOG:
        return Promise.resolve(null)
    }
  }
}
