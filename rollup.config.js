import dotenv from 'dotenv'
import prebuild from './rollup/prebuild.js'
import backend from './rollup/backend.js'
import frontend from './rollup/frontend.js'
import postbuild from './rollup/postbuild.js'

// Config dotenv to pick up environment variables from .env
dotenv.config()

const isProduction = process.env.NODE_ENV === 'production'

const browsers = ['chrome', 'firefox']

const destination = 'build'
const commonPath = `${destination}/common`

// Replace `process.env.REACT_APP_*` with the actual values from the environment
const envVars = Object.entries(process.env)
  .filter(([key]) => key.startsWith('REACT_APP_'))
  .reduce(
    (prev, [key, value]) => ({
      ...prev,
      [`process.env.${key}`]: JSON.stringify(value)
    }),
    {}
  )

const config = [
  ...prebuild(),
  ...backend(envVars, isProduction, commonPath),
  ...frontend(envVars, isProduction, commonPath),
  ...browsers.flatMap((b) => postbuild(b, commonPath, destination))
]

export default config
