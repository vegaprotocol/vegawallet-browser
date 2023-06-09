import { nodeResolve } from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import json from '@rollup/plugin-json'
import terser from '@rollup/plugin-terser'
import replace from '@rollup/plugin-replace'

/**
 * Builds the backend JS
 * @param {object} envVars - The environment variables to replace
 * @param {boolean} isProduction - Whether to build for production
 * @param {string} outputPath - The path to the output folder
 */
export default (envVars, isProduction, outputPath) => [
  // The files that need to each be built for the backend
  ...['background', 'content-script', 'in-page', 'pow-worker'].map((name) => ({
    input: `web-extension/common/${name}.js`,
    output: {
      dir: outputPath,
      format: 'iife',
      entryFileNames: `${name}.js`
    },
    plugins: [
      nodeResolve({ browser: true }),
      json({ compact: isProduction }),
      commonjs(),
      isProduction && terser(),
      // Replace env vars with static values
      replace({
        preventAssignment: true,
        values: {
          ...envVars
        }
      })
    ]
  }))
]
