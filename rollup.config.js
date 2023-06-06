import { nodeResolve } from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import json from '@rollup/plugin-json'
import terser from '@rollup/plugin-terser'
import typescript from '@rollup/plugin-typescript'
import postcss from 'rollup-plugin-postcss'
import html, { makeHtmlAttributes } from '@rollup/plugin-html'
import replace from '@rollup/plugin-replace'
import dotenv from 'dotenv'
import tailwindcss from 'tailwindcss'
import copy from 'rollup-plugin-copy'
import { folderInput } from 'rollup-plugin-folder-input'
import { compileFile } from './rollup/plugins/ajv/compile-ajv-schema.js'
import prebuild from './rollup/prebuild.js'
import backend from './rollup/backend.js'
import frontend from './rollup/frontend.js'

// Config dotenv to pick up environment variables from .env
dotenv.config()

const isProduction = process.env.NODE_ENV === 'production'

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

const config = [...prebuild(), ...backend(envVars, isProduction), ...frontend(envVars, isProduction)]

export default config
