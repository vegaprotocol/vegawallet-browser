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
  const walletConfig = cliArgs['wallet-config']
  const configDirectory = path.resolve('.', 'config')
  const configPath = path.resolve(configDirectory, `${walletConfig}.js`)
  if (!walletConfig) {
    throw new Error(
      `Build arg --wallet-config must be specified. Valid values are the names of the files in the ${configDirectory} directory.`
    )
  } else if (!fs.existsSync(configPath)) {
    throw new Error('Could not find config file for environment: ' + walletConfig + '. At location ' + configPath)
  }
  const isTestBuild = walletConfig === 'test'

  // Remove custom CLI args to prevent errors.
  // https://github.com/rollup/rollup/issues/2694#issuecomment-463915954
  delete cliArgs['wallet-config']
  return [
    ...prebuild(),
    ...backend(isProduction, commonPath, walletConfig),
    ...frontend(isProduction, commonPath, walletConfig),
    ...browsers.flatMap((b) => postbuild(b, commonPath, destination, isTestBuild))
  ]
}
export default config
