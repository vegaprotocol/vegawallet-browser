export default {
  type: 'object',
  additionalProperties: false,
  required: ['wallet', 'passphrase', 'newPassphrase'],
  properties: {
    wallet: {
      type: 'string'
    },
    passphrase: {
      type: 'string'
    },
    newPassphrase: {
      type: 'string'
    }
  }
}
