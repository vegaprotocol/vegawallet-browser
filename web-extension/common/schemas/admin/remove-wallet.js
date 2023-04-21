module.exports = {
  type: 'object',
  additionalProperties: false,
  required: ['wallet'],
  properties: {
    wallet: {
      type: 'string'
    }
  }
}
