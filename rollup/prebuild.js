import ajvPlugin from './plugins/ajv/index.js'
import { folderInput } from 'rollup-plugin-folder-input'

/**
 * Generates the validation files for the client and admin schemas
 * @returns {object[]} - The rollup configs for client and admin
 */
export default () => [
  {
    input: 'web-extension/schemas/client/*.js',
    output: {
      dir: 'web-extension/validation/client'
    },
    plugins: [folderInput(), ajvPlugin()]
  },
  {
    input: 'web-extension/schemas/admin/*.js',
    output: {
      dir: 'web-extension/validation/admin'
    },
    plugins: [folderInput(), ajvPlugin()]
  }
]
