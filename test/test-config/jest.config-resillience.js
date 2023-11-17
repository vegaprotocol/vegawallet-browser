import baseConfig from './jest.config-base-config.js'
import cloneDeep from 'lodash/cloneDeep.js'
import merge from 'lodash/merge.js'

const jestConfigResillience = cloneDeep(baseConfig)
let overrides = {
  roots: ['<rootDir>/test/resillience-tests'],
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
        outputName: `resillience.xml`
      }
    ]
  ]
}

merge(jestConfigResillience, overrides)
export default jestConfigResillience;
