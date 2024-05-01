import messages from '@vegaprotocol/protos/messages.json' assert { type: 'json' }
import fs from 'node:fs'

const EXCLUDED_FIELDS = ['nonce', 'blockHeight']

const inputs = messages.packages.vega.packages.commands.packages.v1.messages.find(({ name }) => name === 'InputData')

const allowedMessages = inputs.fields
  .filter(({ name }) => !EXCLUDED_FIELDS.includes(name))
  .map((b) => ({
    additionalProperties: false,
    required: [b.name],
    properties: {
      [b.name]: {}
    }
  }))

const sendTransactionValidation = {
  type: 'object',
  required: ['publicKey', 'transaction', 'sendingMode'],
  additionalProperties: false,
  errorMessage: '`client.send_transaction` must only be given `publicKey`, `transaction` and `sendingMode`',
  properties: {
    publicKey: {
      type: 'string',
      pattern: '^[0-9a-z]{64}$',
      errorMessage: '`publicKey` must be a 64 character hex encoded publicKey'
    },
    sendingMode: {
      enum: ['TYPE_ASYNC', 1, 'TYPE_SYNC', 2, 'TYPE_COMMIT', 3],
      errorMessage:
        'Only `TYPE_ASYNC` (1), `TYPE_SYNC` (2) and `TYPE_COMMIT` (3) are valid sending modes. The sendingMode must be the string name or numerical enum'
    },
    transaction: {
      type: 'object',
      errorMessage: 'Unsupported transaction type',
      oneOf: allowedMessages
    }
  }
}

const checkTransactionValidation = {
  type: 'object',
  required: ['publicKey', 'transaction', 'origin'],
  additionalProperties: false,
  errorMessage: '`client.send_transaction` must only be given `publicKey`, `transaction` and `origin`',
  properties: {
    publicKey: {
      type: 'string',
      pattern: '^[0-9a-z]{64}$',
      errorMessage: '`publicKey` must be a 64 character hex encoded publicKey'
    },
    origin: {
      type: 'string'
    },
    transaction: {
      type: 'object',
      errorMessage: 'Unsupported transaction type',
      oneOf: allowedMessages
    }
  }
}

fs.writeFileSync(
  'web-extension/schemas/client/send-transaction.json',
  JSON.stringify(sendTransactionValidation, null, 2) + '\n',
  { encoding: 'utf-8' }
)

fs.writeFileSync(
  'web-extension/schemas/admin/check-transaction.json',
  JSON.stringify(checkTransactionValidation, null, 2) + '\n',
  { encoding: 'utf-8' }
)
