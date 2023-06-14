import prebuild from './rollup/prebuild.js'
import backend from './rollup/backend.js'
import frontend from './rollup/frontend.js'
import postbuild from './rollup/postbuild.js'
import fs from 'fs'
import path from 'path'

const isProduction = process.env.NODE_ENV === 'production'

const browsers = ['chrome', 'firefox']

const destination = 'build'
const commonPath = `${destination}/common`

const config = (cliArgs) => {
  const { vegaEnv } = cliArgs
  if (!fs.existsSync(path.resolve('.', 'config', `${vegaEnv}.js`))) {
    throw new Error('Could not find config file for environment: ' + vegaEnv)
  }
  const isTestBuild = vegaEnv === 'test'

  // Remove custom CLI args to prevent errors.
  // https://github.com/rollup/rollup/issues/2694#issuecomment-463915954
  delete cliArgs.vegaEnv
  return [
    ...prebuild(),
    ...backend(isProduction, commonPath, vegaEnv),
    ...frontend(isProduction, commonPath, vegaEnv),
    ...browsers.flatMap((b) => postbuild(b, commonPath, destination, isTestBuild))
  ]
}
export default config
