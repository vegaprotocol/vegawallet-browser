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
    const manifests = await Promise.all(
      opts.manifests.map(async (filePath) => {
        return JSON.parse(await readFile(path.resolve(filePath), 'utf8'))
      })
    )

    this.emitFile({
      type: 'asset',
      name: 'manifest',
      needsCodeReference: false,
      fileName: 'manifest.json',
      source: JSON.stringify(deepmerge.all([...manifests, opts.overrides]), null, 2)
    })
  }
}
