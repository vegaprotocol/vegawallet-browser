module.exports = {
  type: 'object',
  required: ['wallet'],
  additionalProperties: false,
  errorMessage: '`admin.list_keys` must only be given `wallet`',
  properties: {
    wallet: {
      type: 'string'
    }
  }
}
