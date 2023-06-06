export default {
  type: 'object',
  additionalProperties: false,
  required: ['name', 'recoveryPhrase'],
  properties: {
    name: {
      type: 'string'
    },
    recoveryPhrase: {
      type: 'string'
    }
  }
}
