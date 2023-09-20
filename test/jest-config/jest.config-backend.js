import baseConfig from './jest.config-base-config.js'
import cloneDeep from 'lodash/cloneDeep.js'
import merge from 'lodash/merge.js'

const backendConfig = cloneDeep(baseConfig)
let overrides = {
  roots: ['<rootDir>/web-extension'],
  setupFiles: ['jest-webextension-mock', './web-extension/test/setup-tests.js'],
  collectCoverageFrom: ['**/*.js', '!**/node_modules/**'],
  coverageDirectory: 'coverage/backend',
  coverageReporters: ['html', 'lcov'],
  reporters: [
    'default',
    [
      'jest-junit',
      {
        outputName: 'backend-test-results.xml'
      }
    ]
  ]
}

export default merge(backendConfig, overrides)