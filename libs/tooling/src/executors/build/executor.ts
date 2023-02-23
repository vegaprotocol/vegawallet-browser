import path from 'node:path'
import { spawn } from 'node:child_process'
import { remove, stat, rename } from 'fs-extra'
import { esbuildExecutor, EsBuildExecutorOptions } from '@nrwl/esbuild'
import { FsTree, flushChanges } from 'nx/src/generators/tree'
import type { ExecutorContext } from '@nrwl/devkit'
import type { BuildExecutorSchema } from './schema'
import extensionGenerator from '../../generators/extension/generator'

const prepareOutput = async (outputPath: string) => {
  try {
    const outputStats = await stat(outputPath)
    if (outputStats.isDirectory()) {
      await remove(outputPath)
    }
    // eslint-disable-next-line
  } catch (err: any) {
    if ('code' in err && err.code === 'ENOENT') {
      return
    }
    throw err
  }
}

type BuildExtensionProps = {
  sourceDir: string
  targetDir?: string
}

const buildJs = async (
  options: EsBuildExecutorOptions,
  context: ExecutorContext
) => {
  const result = { success: false }

  for await (const item of esbuildExecutor(
    {
      ...options,
      format: ['cjs'],
      minify: false,
      thirdParty: true,
      platform: 'browser',
      project: 'wallet-web',
      target: 'es2017',
      esbuildOptions: {
        // not working :(
        outExtension: {
          '.cjs': '.js',
          '.js': '.js',
        },
        alias: {
          react: path.resolve(context.root, 'node_modules/react'),
          'react-dom': path.resolve(context.root, 'node_modules/react-dom'),
          '@vegaprotocol/wallet-service': path.resolve(
            context.root,
            'libs/wallet-service/src/index.ts'
          ),
        },
        loader: {
          '.png': 'file',
        },
      },
    },
    context
  )) {
    result.success = item.success
  }

  return result
}

const generateExtenstionFiles = async (
  options: BuildExecutorSchema,
  context: ExecutorContext
) => {
  const tree = new FsTree(context.root, false)

  await extensionGenerator(tree, {
    name: options.name,
    description: options.description,
    directory: options.outputPath,
    target: options.target,
    popupHtml: options.popup ? './popup/index.html' : undefined,
    popupJs: options.popup ? './index.js' : undefined,
    popupStyles: options.popup?.styles ? './index.css' : undefined,
    popupTitle: options.name,
    popupDescription: options.description,
    backgroundJs: options.background ? './background/index.js' : undefined,
    contentJs: options.content ? './content/index.js' : undefined,
  })

  const changes = tree.listChanges()

  flushChanges(context.root, changes)
}

const packExtension = async ({ sourceDir, targetDir }: BuildExtensionProps) => {
  await new Promise((resolve, reject) => {
    const process = spawn('yarn', [
      'web-ext',
      'build',
      `--source-dir=${sourceDir}`,
      `--artifacts-dir=${targetDir || sourceDir}`,
    ])
    process.on('error', (err) => {
      reject(err)
    })
    process.on('close', () => {
      resolve(null)
    })
  })
}

export default async function runExecutor(
  options: BuildExecutorSchema,
  context: ExecutorContext
) {
  const project =
    context.projectName && context.workspace.projects[context.projectName]

  if (!project) {
    return {
      success: false,
    }
  }

  try {
    await prepareOutput(options.outputPath)

    const paths = [
      options.background?.main,
      options.popup?.main,
      options.content?.main,
    ].filter((p) => !!p) as string[]

    const outputPaths = [
      options.background?.main && 'background/index.cjs',
      options.popup?.main && 'popup/index.cjs',
      options.content?.main && 'content/index.cjs',
    ].filter((p) => !!p) as string[]

    if (paths.length) {
      await buildJs(
        {
          project: project.root,
          outputPath: path.join(context.root, options.outputPath),
          main: path.join(context.root, paths[0]),
          additionalEntryPoints: paths.slice(1),
          tsConfig: path.join(context.root, project.root, 'tsconfig.lib.json'),
          assets: [],
        },
        context
      )

      // can't get esbuild to output normal .js extension formats, so renaming the .cjs output here
      // the browser extension can't digest .cjs for some reason
      await Promise.all(
        outputPaths.map((p) => {
          return rename(
            path.join(context.root, options.outputPath, p),
            path.join(
              context.root,
              options.outputPath,
              p.replace('.cjs', '.js')
            )
          )
        })
      )
    }

    await generateExtenstionFiles(options, context)

    if (options.target === 'firefox') {
      await packExtension({
        sourceDir: path.join(context.root, options.outputPath),
      })
    }
  } catch (err) {
    console.error(err)
    return {
      success: false,
    }
  }

  return {
    success: true,
  }
}
