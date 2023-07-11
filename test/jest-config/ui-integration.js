import base from './frontend-base.js'

const integrationConfig = {
  ...base,
  coverageDirectory: 'coverage/frontend/integration',
  testRegex: '(/__tests__/.*|(\\.|/)(integration))\\.tsx?$',
  reporters: [
    'default',
    [
      'jest-junit',
      {
        outputDirectory: './test/test-reports',
        outputName: 'ui-unit-test-results.xml'
      }
    ]
  ],
  setupFilesAfterEnv: ['<rootDir>/frontend/test/setupTests.ts', '<rootDir>/frontend/test/setupIntegrationTests.ts']
}

export default integrationConfig
