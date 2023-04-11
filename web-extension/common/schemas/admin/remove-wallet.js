export default {
  type: 'object',
  additionalProperties: false,
  required: ['wallet'],
  properties: {
    wallet: {
      type: 'string'
    }
  }
}
