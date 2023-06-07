import copy from 'rollup-plugin-copy'

/**
 * Copies the common files to the browser-specific build folder
 * and copies the appropriate manifest file to the browser-specific build folder
 * @param {string} browser - The browser to build for
 * @param {string} commonFolder - The folder containing the common files
 * @param {string} build - The browser specific build folder
 */
export default (browser, commonFolder, build) => {
  return [
    {
      // Not actually used, but required by rollup. We're just using thr copy plugin.
      // Using content script as it has no deps & no dep tree to process.
      input: 'web-extension/common/in-page.js',
      // Not actually used, but required by rollup. We're just using thr copy plugin.
      output: {
        dir: commonFolder,
        plugins: [
          {
            name: 'kill-output',
            generateBundle() {
              return []
            }
          }
        ]
      },
      plugins: [
        copy({
          targets: [
            // Copy all common files to the browser-specific build folder
            { src: `${commonFolder}/**/*`, dest: `${build}/${browser}` },
            // Copy the manifest file to the browser-specific build folder
            { src: `${commonFolder}/${browser}.json`, dest: `${build}/${browser}`, rename: 'manifest.json' }
          ]
        })
      ]
    }
  ]
}
