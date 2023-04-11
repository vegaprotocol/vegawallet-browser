export default {
  type: 'object',
  additionalProperties: false,
  required: ['wallet', 'newName'],
  properties: {
    wallet: {
      type: 'string'
    },
    newName: {
      type: 'string'
    }
  }
}
