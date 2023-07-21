import deepmerge from 'deepmerge'
import { readFile } from 'node:fs/promises'
import path from 'node:path'

export default (opts) => {
  return {
    name: 'manifest',
    async buildStart() {
      for (const path of opts.manifests) this.addWatchFile(path)

      await build.call(this)
    },
    watchChange: build
  }
  async function build() {
    const manifestsSrc = await Promise.all(
      opts.manifests.map(async (filePath) => {
        return await readFile(path.resolve(filePath), 'utf8')
      })
    )

    // Replace each string key in each manifest before parsing as JSON
    const manifests = manifestsSrc.map((manifest) => {
      return JSON.parse(Object.entries(opts.replacements ?? {}).reduce((manifest, [key, value]) => {
        return manifest.replaceAll(key, value)
      }, manifest))
    })

    this.emitFile({
      type: 'asset',
      name: 'manifest',
      needsCodeReference: false,
      fileName: opts.outputFile,
      source: JSON.stringify(deepmerge.all([...manifests, opts.overrides]), null, 2)
    })
  }
}
