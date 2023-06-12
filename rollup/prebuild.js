import ajvPlugin from './plugins/ajv/index.js'
import { globSync } from 'glob'

/**
 * Generates the validation files for the client and admin schemas
 * @returns {object[]} - The rollup configs for client and admin
 */
export default () => [
  {
    input: globSync('web-extension/schemas/client/*.json'),
    output: {
      dir: 'web-extension/validation/client'
    },
    plugins: [ajvPlugin()]
  },
  {
    input: globSync('web-extension/schemas/admin/*.json'),
    output: {
      dir: 'web-extension/validation/admin'
    },
    plugins: [ajvPlugin()]
  }
]
