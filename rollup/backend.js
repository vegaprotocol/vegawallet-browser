import { nodeResolve } from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import json from '@rollup/plugin-json'
import terser from '@rollup/plugin-terser'
import replace from '@rollup/plugin-replace'

export default (envVars, isProduction) => [
  ...['background', 'content-script', 'in-page', 'pow-worker'].map((name) => ({
    input: `web-extension/common/${name}.js`,
    output: {
      dir: 'build/common',
      format: 'iife',
      entryFileNames: `${name}.js`
    },
    plugins: [
      nodeResolve({ browser: true }),
      json({ compact: isProduction }),
      commonjs(),
      isProduction && terser(),
      // Replace `process.env.REACT_APP_*` with the actual values from the environment
      replace({
        preventAssignment: true,
        values: {
          ...envVars
        }
      })
    ]
  }))
]
