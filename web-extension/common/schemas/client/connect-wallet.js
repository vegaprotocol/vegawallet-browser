export default {
  type: 'object',
  required: ['hostname'],
  additionalProperties: false,
  errorMessage: '`client.connect_wallet` must only be given `hostname`',
  properties: {
    hostname: {
      type: 'string',
      errorMessage: '`hostname` must be a string'
    }
  }
}
