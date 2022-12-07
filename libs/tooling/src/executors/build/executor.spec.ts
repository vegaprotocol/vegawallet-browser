import { BuildExecutorSchema } from './schema'
import executor from './executor'

const options: BuildExecutorSchema = {
  outputPath: 'dist/libs/wallet-ff-test',
  target: 'firefox',
  name: 'wallet-test',
  description: 'Test extension',
}

describe('Build Executor', () => {
  it('can run', async () => {
    const output = await executor(options, {
      root: './',
      cwd: './',
      isVerbose: false,
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
