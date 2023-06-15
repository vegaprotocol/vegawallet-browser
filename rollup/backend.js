import { nodeResolve } from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import json from '@rollup/plugin-json'
import terser from '@rollup/plugin-terser'
import alias from '@rollup/plugin-alias'
import path from 'path'

const backend = (isProduction, outputPath, walletConfig) => [
  // The files that need to each be built for the backend
  ...['background', 'content-script', 'in-page', 'pow-worker'].map((name) => ({
    input: `web-extension/${name}.js`,
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
      alias({
        entries: [{ find: '@config', replacement: path.resolve('.', 'config', `${walletConfig}.js`) }]
      })
    ]
  }))
]

/**
 * Builds the backend JS
 * @param {object} envVars - The environment variables to replace
 * @param {boolean} isProduction - Whether to build for production
 * @param {string} outputPath - The path to the output folder
 */
export default backend
