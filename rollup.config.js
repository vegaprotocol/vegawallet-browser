import { nodeResolve } from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import json from '@rollup/plugin-json'
import terser from '@rollup/plugin-terser'
import typescript from '@rollup/plugin-typescript'
import postcss from 'rollup-plugin-postcss'

const isProduction = process.env.NODE_ENV === 'production'

export default [
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
      isProduction && terser()
    ]
  })),
  {
    input: './src/index.tsx',
    output: {
      dir: 'build/common',
      format: 'iife',
      entryFileNames: 'popup.js'
    },
    plugins: [
      nodeResolve({ browser: true }),
      json({ compact: isProduction }),
      commonjs(),
      // The below plugin is required to make css imports work, however I'm not sure
      // if it will work with tailwindcss as the rollup plugin is a few versions old?
      // postcss(),

      // Are the above plugins needed? I guess rollup needs to know how to resolve imports
      // but you'd also think all of this is handled by typescript anyway?
      typescript()
    ]
  }
]
