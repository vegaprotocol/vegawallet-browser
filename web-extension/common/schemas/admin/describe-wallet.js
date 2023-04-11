export default {
  type: 'object',
  additionalProperties: false,
  required: ['wallet', 'passphrase'],
  properties: {
    wallet: {
      type: 'string'
    },
    passphrase: {
      type: 'string'
    }
  }
}
