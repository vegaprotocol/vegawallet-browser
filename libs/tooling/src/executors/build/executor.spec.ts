import path from 'path'
import { remove } from 'fs-extra'
import { BuildExecutorSchema } from './schema'
import executor from './executor'

const options: BuildExecutorSchema = {
  outputPath: 'dist/libs/wallet-ff-test',
  target: 'firefox',
  name: 'wallet-test',
  description: 'Test extension',
}

afterAll(async () => {
  await remove(path.join(process.cwd(), options.outputPath))
})

describe('Build Executor', () => {
  it('can run', async () => {
    const output = await executor(options, {
      root: './',
      cwd: './',
      isVerbose: false,
      projectName: 'wallet-test',
      workspace: {
        version: 1,
        projects: {
          'wallet-test': {
            root: 'libs/wallet-test',
          },
        },
      },
    })
    expect(output.success).toBe(true)
  })
})
