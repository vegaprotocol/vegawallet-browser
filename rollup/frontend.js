import { nodeResolve } from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import json from '@rollup/plugin-json'
import typescript from '@rollup/plugin-typescript'
import postcss from 'rollup-plugin-postcss'
import html, { makeHtmlAttributes } from '@rollup/plugin-html'
import tailwindcss from 'tailwindcss'
import autoprefixer from 'autoprefixer'
import copy from 'rollup-plugin-copy'
import alias from '@rollup/plugin-alias'
import path from 'path'
import replace from '@rollup/plugin-replace'

const htmlPlugin = (outputPath) => {
  return html({
    outputDir: outputPath,
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
      </body>
    </html>`
    }
  })
}

/**
 * Builds the frontend JS, CSS, HTML and assets.
 * @param {object} envVars - The environment variables to replace
 * @param {boolean} isProduction - Whether or not this is a production build
 * @param {string} outputPath - The path to output the build to
 */
const frontend = (isProduction, outputPath, vegaEnv) => [
  {
    input: './frontend/index.tsx',
    output: {
      dir: outputPath,
      format: 'iife',
      entryFileNames: 'popup.js'
    },
    plugins: [
      nodeResolve({ browser: true }),
      json({ compact: isProduction }),
      commonjs(),
      // Process CSS
      postcss({
        extensions: ['.css'],
        plugins: [tailwindcss(), autoprefixer()]
      }),
      // Process typescript
      typescript(),
      // Generate HTML
      htmlPlugin(outputPath),
      // Replace env vars with static values
      alias({
        entries: [{ find: '@config', replacement: path.resolve('.', 'config', `${vegaEnv}.js`) }]
      }),
      replace({
        preventAssignment: true,
        values: {
          'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV)
        }
      }),
      // Copy static assets
      copy({
        targets: [{ src: 'assets/**/*', dest: outputPath }]
      })
    ]
  }
]

export default frontend
