import baseConfig from './jest.config-base-config.js'
import cloneDeep from 'lodash/cloneDeep.js'
import merge from 'lodash/merge.js'

/** @type {import('ts-jest').JestConfigWithTsJest} */
const jestConfigUI = cloneDeep(baseConfig)

let overrides = {
  roots: ['<rootDir>/frontend'],
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/frontend/setupTests.ts'],
  globalSetup: '<rootDir>/frontend/global-setup.ts',
  testRegex: '(/__tests__/.*|(\\.|/)(test|spec))\\.tsx?$',
  collectCoverageFrom: ['**/*.{ts,tsx}', '!**/node_modules/**', '!test/**'],
  coverageDirectory: 'coverage/frontend',
  coverageReporters: ['html', 'lcov'],
  coverageThreshold: {
    global: {
      branches: 98.2,
      functions: 99.5,
      lines: 100,
      statements: 100
    }
  },
  reporters: [
    'default',
    [
      'jest-junit',
      {
        outputName: 'unit-test-results.xml'
      }
    ]
  ]
}

export default merge(jestConfigUI, overrides)
