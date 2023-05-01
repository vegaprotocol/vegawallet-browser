module.exports = {
  type: 'object',
  additionalProperties: false,
  required: ['name', 'newName'],
  properties: {
    name: {
      type: 'string'
    },
    newName: {
      type: 'string'
    }
  }
}
