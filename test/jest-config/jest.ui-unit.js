import base from './frontend-base.js'

const unitConfig = {
  ...base,
  coverageDirectory: 'coverage/frontend/unit',
  testRegex: '(/__tests__/.*|(\\.|/)(unit|spec|test))\\.tsx?$',
  reporters: [
    'default',
    [
      'jest-junit',
      {
        outputDirectory: './test/test-reports',
        outputName: 'ui-integration-test-results.xml'
      }
    ]
  ],
  setupFilesAfterEnv: ['<rootDir>/frontend/test/setupTests.ts', '<rootDir>/frontend/test/setupUnitTests.ts']
}

export default unitConfig
