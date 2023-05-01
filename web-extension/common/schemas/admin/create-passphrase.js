module.exports = {
  type: 'object',
  additionalProperties: false,
  required: ['passphrase'],
  properties: {
    passphrase: {
      type: 'string'
    }
  }
}
