import ajvPlugin from './plugins/ajv/index.js'
import { folderInput } from 'rollup-plugin-folder-input'

/**
 * Generates the validation files for the client and admin schemas
 * @returns {object[]} - The rollup configs for client and admin
 */
export default () => [
  {
    input: 'web-extension/common/schemas/client/*.js',
    output: {
      dir: 'web-extension/common/validation/client'
    },
    plugins: [folderInput(), ajvPlugin()]
  },
  {
    input: 'web-extension/common/schemas/admin/*.js',
    output: {
      dir: 'web-extension/common/validation/admin'
    },
    plugins: [folderInput(), ajvPlugin()]
  }
]
