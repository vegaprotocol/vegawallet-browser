import baseConfig from './jest.config-base-config.js'
import cloneDeep from 'lodash/cloneDeep.js'
import merge from 'lodash/merge.js'

const jestConfigE2E = cloneDeep(baseConfig)
let overrides = {
  roots: ['<rootDir>/test/e2e'],
  preset: 'ts-jest',
  testEnvironment: 'node',
  setupFilesAfterEnv: ['<rootDir>/test/e2e/setupTests.ts', '<rootDir>/test/e2e/setupMocks.ts' ],
  testTimeout: 360000,
  reporters: [
    'default',
    [
      'jest-junit',
      {
        outputDirectory: './test/test-reports',
        outputName: `${process.env.BROWSER}-e2e-test-results.xml`
      }
    ]
  ]
}

merge(jestConfigE2E, overrides)
export default jestConfigE2E;
