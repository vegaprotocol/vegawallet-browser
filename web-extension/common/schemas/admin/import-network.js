export default {
  type: 'object',
  additionalProperties: false,
  required: ['name', 'url', 'overwrite'],
  properties: {
    name: {
      type: 'string'
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
