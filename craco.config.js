const WebpackBeforeBuildPlugin = require('before-build-webpack')
const { glob } = require('glob')
const { compileFile } = require('./scripts/compile-ajv-schema')
const _ = require('lodash')
const fs = require('fs/promises')
const path = require('path')

/*
Reorganise file paths
Move UI into common folder in extension

*/

function concatMerger(objValue, srcValue) {
  if (_.isArray(objValue)) {
    return objValue.concat(srcValue)
  }
  return _.merge(srcValue, objValue)
}

const compileValidation = async () => {
  const paths = await glob('./web-extension/common/schemas/**/*.js')
  await Promise.all(
    paths.map((path) =>
      compileFile(path, path.replace('schemas/', 'validation/'))
    )
  )
}

const buildManifest = async (browser, appPath) => {
  const manifest = require('./web-extension/common/manifest.json')

  const packageJson = require('./package.json')
  const destinationPath = `${appPath}/manifest.json`
  const browserManifest = require(`./web-extension/${browser}/manifest.json`)
  const mergedManifest = _.mergeWith(manifest, browserManifest, concatMerger)
  mergedManifest.version = packageJson.version
  await fs.mkdir(path.dirname(destinationPath), { recursive: true })
  await fs.writeFile(destinationPath, JSON.stringify(mergedManifest, null, 2))
}

module.exports = {
  webpack: {
    configure: (webpackConfig, { env, paths }) => {
      const browser = process.argv.includes('--build-chrome')
        ? 'chrome'
        : process.argv.includes('--build-firefox')
        ? 'firefox'
        : null
      if (!browser) {
        throw new Error('Must specify --build-chrome or --build-firefox')
      }
      paths.appBuild = webpackConfig.output.path = path.resolve(
        'build',
        browser
      )

      const fallback = webpackConfig.resolve.fallback || {}
      // Webpack 5 does not bundle some node things that CRA relies on. Polyfill these.
      Object.assign(fallback, {
        url: require.resolve('url'),
      })
      webpackConfig.module.rules = [
        {
          test: /\.(mjs|js)?$/,
          resolve: {
            fullySpecified: false,
          },
        },
        ...webpackConfig.module.rules,
      ]
      return {
        ...webpackConfig,
        entry: {
          main: [
            env === 'development' &&
              require.resolve('react-dev-utils/webpackHotDevClient'),
            paths.appIndexJs,
          ].filter(Boolean),
          'content-script': './web-extension/common/content-script.js',
          background: './web-extension/common/background.js',
          'pow-worker': './web-extension/common/pow-worker.js',
          'in-page': './web-extension/common/in-page.js',
        },
        output: {
          ...webpackConfig.output,
          filename: `static/js/[name].js`,
        },
        optimization: {
          ...webpackConfig.optimization,
          runtimeChunk: false,
        },
        plugins: [
          new WebpackBeforeBuildPlugin(async (stats, callback) => {
            try {
              await compileValidation()
              await buildManifest(browser, paths.appBuild)
              return callback()
            } catch (e) {
              console.log(e)
              return callback(e)
            }
          }),
          ...webpackConfig.plugins,
        ],
      }
    },
  },
}
