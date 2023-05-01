module.exports = {
  type: 'object',
  additionalProperties: false,
  required: ['wallet'],
  properties: {
    wallet: {
      type: 'string'
    },
    name: {
      type: 'string'
    },
    metadata: {
      type: 'object'
    },
    options: {
      type: 'object',
      additionalProperties: false,
      properties: {
        // TODO add options
      }
    }
  }
}
