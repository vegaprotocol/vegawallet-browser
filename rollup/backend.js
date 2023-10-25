import { nodeResolve } from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import json from '@rollup/plugin-json'
import terser from '@rollup/plugin-terser'
import alias from '@rollup/plugin-alias'
import path from 'path'
import { visualizer } from 'rollup-plugin-visualizer'
import copy from 'rollup-plugin-copy'

const backend = ({ isProduction, outputPath, walletConfigName, analyze }) => [
  // The files that need to each be built for the backend
  ...['background', 'content-script', 'in-page', 'pow-worker', 'chrome-pow'].map((name) => ({
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
      copy({
        targets: [{ src: 'web-extension/chrome-pow.html', dest: outputPath }]
      }),
      alias({
        entries: [{ find: '!/config', replacement: path.resolve('.', 'config', `${walletConfigName}.js`) }]
      }),
      analyze &&
      visualizer({
        filename: `./build/analyze/${name}.html`
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
