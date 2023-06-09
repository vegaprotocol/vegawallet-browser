import copy from 'rollup-plugin-copy'
import mainfest from './plugins/manifest/index.js'
import pkg from '../package.json' assert { type: 'json' }

const fileName = 'I_SHOULD_NOT_EXIST.js'

/**
 * Copies the common files to the browser-specific build folder
 * and copies the appropriate manifest file to the browser-specific build folder
 * @param {string} browser - The browser to build for
 * @param {string} commonFolder - The folder containing the common files
 * @param {string} build - The browser specific build folder
 */
export default (browser, commonFolder, build, isTestBuild) => {
  const testReplacements = isTestBuild
    ? {
        key: 'MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA08UzOSHIQYHM54WUFpkwdli9r64CjLvR0zQywfNvJEW808vRJF86esnXtgFn+XaPc/rKL1SguiGrhi0DJH6uzNEBs37q7kEsEzK+yxWu8OPGp8Bf6p1MnvT5m/44tXqcbdLll3K8rBrNq8PAGIbw7AI/dkLnK1UosVDkkO7CCqLYLDp0ccJTLs1ALS78o6Es9tg91DuTRJyNc1HP8rZn0FL+rjOkqAX+26rhy+UOwWvqe7FZbMU18ZsQ5Z/rFWAYnRG6+lWMMWYBsU2irwRLVPd4RydEr2JKeaNi9V42a7kAtDlYW9607LCOtXfAJTIA3g2zrtxvPBSLMO84abvGzwIDAQAB'
      }
    : {}
  return [
    {
      // Not actually used, but required by rollup. We're just using thr copy plugin.
      // Using content script as it has no deps & no dep tree to process.
      input: 'web-extension/common/in-page.js',
      // Not actually used, but required by rollup. We're just using thr copy plugin.
      output: {
        dir: `${build}/${browser}`,
        entryFileNames: fileName
      },
      plugins: [
        {
          name: 'kill-output',
          // Removes the output file from the bundle, as we are just looking to use the copy plugin
          generateBundle(_, bundle) {
            delete bundle[fileName]
          }
        },

        mainfest({
          manifests: [`web-extension/common/manifest.json`, `web-extension/${browser}/manifest.json`],
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
