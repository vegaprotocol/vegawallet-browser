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
      branches: 96,
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

// export default frontendConfig;

// export default {
//   rootDir: '../..',
//   roots: ['<rootDir>/frontend'],

//   // Jest transformations -- this adds support for TypeScript
//   // using ts-jest
//   transform: {
//     '^.+\\.tsx?$': 'ts-jest',
//     '^.+\\.jsx?$': 'ts-jest'
//   },

//   testEnvironment: 'jsdom',

//   // Runs special logic, such as cleaning up components
//   // when using React Testing Library and adds special
//   // extended assertions to Jest
//   // setupFilesAfterEnv: ['@testing-library/react/cleanup-after-each', '@testing-library/jest-dom/extend-expect'],

//   // Test spec file resolution pattern
//   // Matches parent folder `__tests__` and filename
//   // should contain `test` or `spec`.
//   testRegex: '(/__tests__/.*|(\\.|/)(test|spec))\\.tsx?$',

//   setupFilesAfterEnv: ['<rootDir>/frontend/setupTests.ts'],
//   globalSetup: '<rootDir>/frontend/global-setup.ts',

//   collectCoverageFrom: ['**/*.{ts,tsx}', '!**/node_modules/**', '!test/**'],
//   coverageDirectory: 'coverage/frontend',
//   coverageReporters: ['html', 'lcov'],
//   coverageThreshold: {
//     global: {
//       branches: 96,
//       functions: 99.5,
//       lines: 100,
//       statements: 100
//     }
//   },

//   reporters: [
//     'default',
//     [
//       'jest-junit',
//       {
//         outputDirectory: './test/test-reports',
//         outputName: 'unit-test-results.xml'
//       }
//     ]
//   ],

//   // Module file extensions for importing
//   moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
//   moduleNameMapper: {
//     '!/config': '<rootDir>/config/test.js'
//   }
// }
