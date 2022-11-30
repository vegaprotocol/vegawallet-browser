import path from 'node:path'
import { spawn } from 'node:child_process'
import { esbuildExecutor, EsBuildExecutorOptions } from '@nrwl/esbuild'
import { FsTree } from 'nx/src/generators/tree'
import type { ExecutorContext } from '@nrwl/devkit'
import type { BuildExecutorSchema } from './schema'
import { extensionGenerator } from '../../'

type BuildExtensionProps = {
  sourceDir: string
  targetDir?: string
}

const buildJs = async (options: EsBuildExecutorOptions, context: ExecutorContext) => {
  const result = { success: false }

  for await (const item of esbuildExecutor(options, {
    ...context,
    target: {
      ...context.target,
      options,
    },
  })) {
    result.success = item.success
  }

  return result
}

const packExtension = async ({ sourceDir, targetDir }: BuildExtensionProps) => {
  await new Promise((resolve, reject) => {
    const process = spawn('yarn', [
      'web-ext',
      'build',
      `--source-dir=${sourceDir}`,
      `--artifacts-dir=${targetDir || sourceDir}`
    ])
    process.on('error', (err) => {
      reject(err)
    })
    process.on('close', (bbb) => {
      console.log(bbb)
      resolve(null)
    })
  })
}

export default async function* runExecutor(
  options: BuildExecutorSchema,
  context: ExecutorContext,
) {
  const project = context.workspace.projects[context.projectName]

  // await buildJs({
  //   outputPath: path.join(context.root, options.outputPath),
  //   main: path.join(context.root, project.root, 'src', 'index.tsx'),
  //   project: path.join(context.root, project.root, 'package.json'),
  //   tsConfig: path.join(context.root, project.root, 'tsconfig.lib.json'),
  //   platform: 'browser',
  //   format: ['esm'],
  //   deleteOutputPath: true,
  //   assets: [{
  //     glob: 'README.md',
  //     input: context.root,
  //     output: '.',
  //   }],
  // }, context)


  await extensionGenerator(new FsTree(project.root, false), {
    name: context.projectName,
    directory: path.join(context.root, options.outputPath),
  })

  // switch (options.target) {
  //   case 'firefox': {
  //     await packExtension({
  //       sourceDir: path.join(context.root, options.outputPath),
  //     })
  //     breakx
  //   }
  //   default: {
  //     throw new Error('Unsupported build target.')
  //   }
  // }

  return {
    success: true,
  }
}
