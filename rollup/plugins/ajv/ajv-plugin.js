import { compileFile } from './compile-ajv-schema.js'

export default () => ({
  name: 'ajv-compile',
  async transform(_, path) {
    const schema = await import(path)
    const compiled = await compileFile(schema.default)
    return compiled
  }
})
