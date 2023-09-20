import baseConfig from './jest.config-base-config.js'
import cloneDeep from 'lodash/cloneDeep.js'
import merge from 'lodash/merge.js'

const jestConfigE2E = cloneDeep(baseConfig)
let overrides = {
  roots: ['<rootDir>/test'],
  preset: 'ts-jest',
  testEnvironment: 'node',
  setupFilesAfterEnv: ['<rootDir>/test/e2e/setupTests.ts'],
  testTimeout: 120000,
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
