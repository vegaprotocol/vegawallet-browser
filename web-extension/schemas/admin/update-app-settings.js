export default {
  type: 'object',
  additionalProperties: false,
  required: ['telemetry'],
  properties: {
    telemetry: {
      type: 'boolean'
    }
  }
}
