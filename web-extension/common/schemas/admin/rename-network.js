module.exports = {
  type: 'object',
  additionalProperties: false,
  required: ['network', 'newName'],
  properties: {
    network: {
      type: 'string'
    },
    newName: {
      type: 'string'
    }
  }
}
