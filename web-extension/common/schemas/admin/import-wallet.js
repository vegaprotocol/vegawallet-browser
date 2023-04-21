module.exports = {
  type: 'object',
  additionalProperties: false,
  required: ['wallet', 'passphrase', 'recoveryPhrase', 'keyDerivationVersion'],
  properties: {
    wallet: {
      type: 'string'
    },
    passphrase: {
      type: 'string'
    },
    recoveryPhrase: {
      type: 'string'
    },
    keyDerivationVersion: {
      enum: [2]
    }
  }
}
