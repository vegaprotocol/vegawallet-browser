import { nodeResolve } from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import json from '@rollup/plugin-json'
import terser from '@rollup/plugin-terser'
import typescript from '@rollup/plugin-typescript'
import postcss from 'rollup-plugin-postcss'
import html, { makeHtmlAttributes } from '@rollup/plugin-html'
const isProduction = process.env.NODE_ENV === 'production'

const config = [
  ...['background', 'content-script', 'in-page', 'pow-worker'].map((name) => ({
    input: `web-extension/common/${name}.js`,
    output: {
      dir: 'build/common',
      format: 'iife',
      entryFileNames: `${name}.js`
    },
    plugins: [nodeResolve({ browser: true }), json({ compact: isProduction }), commonjs(), isProduction && terser()]
  })),
  {
    input: './src/index.tsx',
    output: {
      dir: 'build/common',
      format: 'iife',
      entryFileNames: 'popup.js'
    },
    plugins: [
      html({
        outputDir: 'build/common',
        title: 'Vega browser wallet',
        template: ({ attributes, bundle, files, publicPath, title, meta }) => {
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
      }),
      nodeResolve({ browser: true }),
      json({ compact: isProduction }),
      commonjs(),
      // The below plugin is required to make css imports work, however I'm not sure
      // if it will work with tailwindcss as the rollup plugin is a few versions old?
      postcss(),

      // Are the above plugins needed? I guess rollup needs to know how to resolve imports
      // but you'd also think all of this is handled by typescript anyway?
      typescript()
    ]
  }
]

export default config
