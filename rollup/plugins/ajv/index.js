import { compileFile } from './compile-ajv-schema.js'

const ajvPlugin = () => ({
  name: 'ajv-compile',
  async transform(code, path) {
    const parsed = JSON.parse(code)
    const compiled = await compileFile(parsed)
    return compiled
  }
})

export default ajvPlugin
