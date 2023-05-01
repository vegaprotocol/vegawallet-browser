module.exports = {
  type: 'object',
  additionalProperties: false,
  required: ['telemetry'],
  properties: {
    telemetry: {
      type: 'boolean'
    }
  }
}
