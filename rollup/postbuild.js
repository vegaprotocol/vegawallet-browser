import copy from 'rollup-plugin-copy'
import mainfest from './plugins/manifest/index.js'
import pkg from '../package.json' assert { type: 'json' }
import { glob } from 'glob'

export const chromePublicKey = 'MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA08UzOSHIQYHM54WUFpkwdli9r64CjLvR0zQywfNvJEW808vRJF86esnXtgFn'
const fileName = 'I_SHOULD_NOT_EXIST.js'

/**
 * Copies the common files to the browser-specific build folder
 * and copies the appropriate manifest file to the browser-specific build folder
 * @param {string} browser - The browser to build for
 * @param {string} commonFolder - The folder containing the common files
 * @param {string} build - The browser specific build folder
 */
export default async (browser, commonFolder, build, isTestBuild, walletConfig) => {
  const { default: config } = await import(`../config/${walletConfig}.js`)

  const testReplacements = isTestBuild && browser === 'chrome'
    ? {
      key: chromePublicKey
    }
    : {}
  return [
    {
      // Not actually used, but required by rollup. We're just using thr copy plugin.
      // Using content script as it has no deps & no dep tree to process.
      input: 'web-extension/in-page.js',
      // Not actually used, but required by rollup. We're just using thr copy plugin.
      output: {
        dir: `${build}`,
        entryFileNames: fileName
      },
      plugins: [
        {
          name: 'kill-output',
          // Removes the output file from the bundle, as we are just looking to use the copy plugin
          generateBundle(_, bundle) {
            delete bundle[fileName]
          },
          async buildStart() {
            const files = await glob(`${commonFolder}/**`)
            files.forEach((f) => this.addWatchFile(f))
          }
        },

        mainfest({
          manifests: [`manifests/common.json`, `manifests/${browser}.json`],
          outputFile: `${browser}/manifest.json`,
          replacements: {
            // Used to prefix all icons eg. Fairground-16x16.png
            __ICON_PREFIX__: config.manifestReplacements.iconPrefix,

            // Used in the extension name
            __BUILD_NAME__: config.manifestReplacements.buildName,

            __GECKO_ID__: config.manifestReplacements.geckoId,
          },
          overrides: {
            version: pkg.version,
            ...testReplacements
          }
        }),
        copy({
          targets: [
            // Copy all common files to the browser-specific build folder
            { src: `${commonFolder}/**/*`, dest: `${build}/${browser}` }
          ]
        })
      ]
    }
  ]
}
