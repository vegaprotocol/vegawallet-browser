module.exports = {
  type: 'object',
  additionalProperties: false,
  required: ['name', 'url', 'overwrite'],
  properties: {
    name: {
      type: 'string',
      minLength: 1
    },
    url: {
      type: 'string'
      // format: 'url'
    },
    overwrite: {
      type: 'boolean'
    }
  }
}
