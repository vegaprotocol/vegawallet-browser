import path from 'node:path'
import { spawn } from 'node:child_process'
import { remove, stat } from 'fs-extra'
import { webpackExecutor, WebpackExecutorOptions } from '@nrwl/webpack'
import { FsTree, flushChanges } from 'nx/src/generators/tree'
import type { ExecutorContext } from '@nrwl/devkit'
import type { BuildExecutorSchema } from './schema'
import { extensionGenerator } from '../../'

const prepareOutput = async (outputPath: string) => {
  try {
    const outputStats = await stat(outputPath)
    if (outputStats.isDirectory) {
      await remove(outputPath)
    }
  } catch (err) {
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
  options: WebpackExecutorOptions,
  context: ExecutorContext
) => {
  const result = { success: false }

  for await (const item of webpackExecutor(
    {
      ...options,
      sourceMap: true,
      fileReplacements: [],
      assets: [],
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
    popupJs: options.popup ? './main.js' : undefined,
    popupTitle: options.name,
    popupDescription: options.description,
    popupStyles: options.popup?.styles ? './styles.css' : undefined,
    backgroundJs: options.background ? './main.js' : undefined,
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
  const project = context.workspace.projects[context.projectName]

  try {
    await prepareOutput(options.outputPath)

    if (options.popup) {
      await buildJs(
        {
          compiler: 'swc',
          outputPath: path.join(context.root, options.outputPath, 'popup'),
          main: path.join(context.root, options.popup.main),
          tsConfig: path.join(context.root, options.popup.tsConfig),
          styles: [path.join(context.root, options.popup.styles)],
          webpackConfig: path.join(
            context.root,
            project.root,
            'webpack.popup.config.js'
          ),
        },
        context
      )
    }

    if (options.background) {
      await buildJs(
        {
          compiler: 'swc',
          outputPath: path.join(context.root, options.outputPath, 'background'),
          main: path.join(context.root, options.background.main),
          tsConfig: path.join(context.root, options.background.tsConfig),
          webpackConfig: path.join(
            context.root,
            project.root,
            'webpack.background.config.js'
          ),
        },
        context
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
