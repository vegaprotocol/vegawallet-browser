import type {
  RawInteraction,
  InteractionResponse,
  InteractionResponseType,
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

export const traceID = '1'

export const EventDataMap: Record<InteractionType, RawInteraction> = {
  INTERACTION_SESSION_BEGAN: {
    traceID,
    name: 'INTERACTION_SESSION_BEGAN',
  },
  INTERACTION_SESSION_ENDED: {
    traceID,
    name: 'INTERACTION_SESSION_ENDED',
  },
  LOG: {
    traceID,
    name: 'LOG',
    data: {
      type: 'Info',
      message: 'What a sunny day!',
    },
  },
  ERROR_OCCURRED: {
    traceID,
    name: 'ERROR_OCCURRED',
    data: {
      name: 'Error',
      error: 'Oh no, this happened!',
    },
  },
  REQUEST_SUCCEEDED: {
    traceID,
    name: 'REQUEST_SUCCEEDED',
    data: {
      message: 'Success!',
    },
  },
  REQUEST_TRANSACTION_REVIEW_FOR_SENDING: {
    traceID,
    name: 'REQUEST_TRANSACTION_REVIEW_FOR_SENDING',
    data: {
      hostname: 'http://example.com',
      wallet: 'wallet-1',
      publicKey: '0x1',
      transaction: '<TRANSACTION_CONTENT>',
      receivedAt: new Date('2023/01/01').toISOString(),
    },
  },
  TRANSACTION_SUCCEEDED: {
    traceID,
    name: 'TRANSACTION_SUCCEEDED',
    data: {
      txHash: '0x0',
      tx: '<TX>',
      deserializedInputData: '<TRANSACTION_INPUT>',
      sentAt: new Date('2023/01/01').toISOString(),
    },
  },
  TRANSACTION_FAILED: {
    traceID,
    name: 'TRANSACTION_FAILED',
    data: {
      tx: '<TX>',
      deserializedInputData: '<TRANSACTION_INPUT>',
      error: {
        Message: 'Transaction Error',
      },
      sentAt: new Date('2023/01/01').toISOString(),
    },
  },
  REQUEST_PERMISSIONS_REVIEW: {
    traceID,
    name: 'REQUEST_PERMISSIONS_REVIEW',
    data: {
      hostname: 'http://example.com',
      wallet: 'wallet-1',
      permissions: {
        public_keys: 'read',
      },
    },
  },
  REQUEST_WALLET_CONNECTION_REVIEW: {
    traceID,
    name: 'REQUEST_WALLET_CONNECTION_REVIEW',
    data: {
      hostname: 'http://example.com',
    },
  },
  REQUEST_WALLET_SELECTION: {
    traceID,
    name: 'REQUEST_WALLET_SELECTION',
    data: {
      hostname: 'http://example.com',
      availableWallets: ['wallet-1', 'wallet-2'],
    },
  },
  REQUEST_PASSPHRASE: {
    traceID,
    name: 'REQUEST_PASSPHRASE',
    data: {
      wallet: 'wallet-1',
    },
  },
}

export const EventResponseDataMap: Record<
  InteractionResponseType,
  InteractionResponse
> = {
  CANCEL_REQUEST: {
    traceID,
    name: 'CANCEL_REQUEST',
  },
  DECISION: {
    traceID,
    name: 'DECISION',
    data: {
      approved: true,
    },
  },
  ENTERED_PASSPHRASE: {
    traceID,
    name: 'ENTERED_PASSPHRASE',
    data: {
      passphrase: 'xyz',
    },
  },
  SELECTED_WALLET: {
    traceID,
    name: 'SELECTED_WALLET',
    data: {
      wallet: 'test',
      passphrase: 'xyz',
    },
  },
  WALLET_CONNECTION_DECISION: {
    traceID,
    name: 'WALLET_CONNECTION_DECISION',
    data: {
      connectionApproval: 'APPROVED_ONLY_THIS_TIME',
    },
  },
}

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
      case 'INTERACTION_SESSION_BEGAN':
        return Promise.resolve(null)
      case 'INTERACTION_SESSION_ENDED':
        return Promise.resolve(null)
      case 'REQUEST_WALLET_CONNECTION_REVIEW':
        return Promise.resolve({
          traceID: event.traceID,
          name: 'WALLET_CONNECTION_DECISION',
          data: {
            connectionApproval: 'APPROVED_ONLY_THIS_TIME',
          },
        })
      case 'REQUEST_WALLET_SELECTION':
        return Promise.resolve({
          traceID: event.traceID,
          name: 'SELECTED_WALLET',
          data: {
            wallet: 'test',
            passphrase: '123',
          },
        })
      case 'REQUEST_PERMISSIONS_REVIEW':
        return Promise.resolve({
          traceID: event.traceID,
          name: 'DECISION',
          data: {
            approved: true,
          },
        })
      case 'REQUEST_TRANSACTION_REVIEW_FOR_SENDING':
        return Promise.resolve({
          traceID: event.traceID,
          name: 'DECISION',
          data: {
            approved: true,
          },
        })
      case 'TRANSACTION_SUCCEEDED':
        return Promise.resolve(null)
      case 'TRANSACTION_FAILED':
        return Promise.resolve(null)
      case 'REQUEST_PASSPHRASE':
        return Promise.resolve({
          traceID: event.traceID,
          name: 'ENTERED_PASSPHRASE',
          data: {
            passphrase: '123',
          },
        })
      case 'REQUEST_SUCCEEDED':
        return Promise.resolve(null)
      case 'ERROR_OCCURRED':
        return Promise.resolve(null)
      case 'LOG':
        return Promise.resolve(null)
    }
  }
}
