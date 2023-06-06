export default {
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
      errorMessage: '`transaction` must contain only one of the valid commands',
      oneOf: [
        'orderSubmission',
        'orderCancellation',
        'orderAmendment',
        'withdrawSubmission',
        'proposalSubmission',
        'voteSubmission',
        'liquidityProvisionSubmission',
        'delegateSubmission',
        'undelegateSubmission',
        'liquidityProvisionCancellation',
        'liquidityProvisionAmendment',
        'transfer',
        'cancelTransfer',
        'announceNode',
        'batchMarketInstructions',
        'nodeVote',
        'nodeSignature',
        'chainEvent',
        'keyRotateSubmission',
        'stateVariableProposal',
        'validatorHeartbeat',
        'ethereumKeyRotateSubmission',
        'protocolUpgradeProposal',
        'issueSignatures',
        'oracleDataSubmission'
      ].map((command) => ({
        additionalProperties: false,
        required: [command],
        properties: { [command]: {} }
      }))
    }
  }
}
