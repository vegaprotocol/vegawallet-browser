import ajvPlugin from './helpers/ajv/ajv-plugin.js'
import { folderInput } from 'rollup-plugin-folder-input'

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
