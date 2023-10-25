import prebuild from './rollup/prebuild.js'
import backend from './rollup/backend.js'
import frontend from './rollup/frontend.js'
import postbuild from './rollup/postbuild.js'
import path from 'path'

const isProduction = process.env.NODE_ENV === 'production'

const browsers = ['chrome', 'firefox']

const destinationPath = 'build'
const commonPath = `${destinationPath}/common`

const config = async (cliArgs) => {
  const { 'wallet-config': walletConfigName, analyze } = cliArgs
  // Remove custom CLI args to prevent errors.
  // https://github.com/rollup/rollup/issues/2694#issuecomment-463915954
  delete cliArgs['wallet-config']
  delete cliArgs.analyze

  const configDirectory = path.resolve('.', 'config')
  const configPath = path.resolve(configDirectory, `${walletConfigName}.js`)
  if (!walletConfigName) {
    throw new Error(
      `Build arg --wallet-config must be specified. Valid values are the names of the files in the ${configDirectory} directory.`
    )
  }

  let config
  try {
    config = (await import(configPath)).default
  } catch (e) {
    throw new Error(`Could not load config file ${configPath}.`)
  }

  const isTestBuild = walletConfigName === 'test' || walletConfigName.includes('console-smoke')

  const postbuilds = await Promise.all(browsers.map((b) => postbuild(b, commonPath, destinationPath, isTestBuild, walletConfigName, config)))

  return [
    ...prebuild(),
    ...backend({
      isProduction, outputPath: commonPath, walletConfigName, analyze
    }),
    ...frontend({
      isProduction, outputPath: commonPath, walletConfigName, analyze, config
    }),
    ...postbuilds.flat()
  ]
}
export default config
