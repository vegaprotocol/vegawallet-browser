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
import { compileFile } from './scripts/compile-ajv-schema.js'

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

// function concatMerger(objValue, srcValue) {
//   if (_.isArray(objValue)) {
//     return objValue.concat(srcValue)
//   }
//   return _.merge(srcValue, objValue)
// }

// const buildManifest = async (browser, appPath) => {
//   const manifest = await import('./web-extension/common/manifest.json')

//   const packageJson = await import('./package.json')
//   const destinationPath = `${appPath}/manifest.json`
//   const browserManifest = await import(`./web-extension/${browser}/manifest.json`)
//   const mergedManifest = _.mergeWith(manifest, browserManifest, concatMerger)
//   mergedManifest.version = packageJson.version
//   await fs.mkdir(path.dirname(destinationPath), { recursive: true })
//   await fs.writeFile(destinationPath, JSON.stringify(mergedManifest, null, 2))
// }

const config = [
  {
    input: 'web-extension/common/schemas/client/*.js',
    output: {
      dir: 'web-extension/common/validation/client'
    },
    plugins: [
      folderInput(),
      {
        name: 'avj-compile', // this name will show up in warnings and errors
        async transform(_, path) {
          const schema = await import(path)
          const compiled = await compileFile(schema.default)
          return compiled
        }
      }
    ]
  },
  {
    input: 'web-extension/common/schemas/admin/*.js',
    output: {
      dir: 'web-extension/common/validation/admin'
    },
    plugins: [
      folderInput(),
      {
        name: 'avj-compile', // this name will show up in warnings and errors
        async transform(_, path) {
          const schema = await import(path)
          const compiled = await compileFile(schema.default)
          return compiled
        }
      }
    ]
  },
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
      postcss({
        extensions: ['.css'],
        plugins: [tailwindcss()]
      }),

      // Are the above plugins needed? I guess rollup needs to know how to resolve imports
      // but you'd also think all of this is handled by typescript anyway?
      typescript(),
      html({
        outputDir: 'build/common',
        title: 'Vega browser wallet',
        template: ({ attributes, files, publicPath, title, meta }) => {
          const scripts = (files.js || [])
            .map(({ fileName }) => {
              const attrs = makeHtmlAttributes(attributes.script)
              return `<script src="${publicPath}${fileName}"${attrs}></script>`
            })
            .join('\n')

          const links = (files.css || [])
            .map(({ fileName }) => {
              const attrs = makeHtmlAttributes(attributes.link)
              return `<link href="${publicPath}${fileName}" rel="stylesheet"${attrs}>`
            })
            .join('\n')

          const metas = meta
            .map((input) => {
              const attrs = makeHtmlAttributes(input)
              return `<meta${attrs}>`
            })
            .join('\n')
          return `<!DOCTYPE html>
<html lang="en">
  <head>
    ${metas}
    <title>${title}</title>
    ${links}
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="theme-color" content="#000000" />
  </head>
  <body class="font-alpha">
    <noscript>You need to enable JavaScript to run this app.</noscript>
    <div id="root"></div>
    ${scripts}
    <!-- TODO there must be better way to do this -->
    <script src="background.js"></script> 
  </body>
</html>`
        }
      }),
      replace({
        preventAssignment: true,
        values: {
          'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
          ...envVars
        }
      }),
      // Copy static assets
      copy({
        targets: [{ src: 'public/**/*', dest: 'build/common' }]
      })
    ]
  }
]

export default config
