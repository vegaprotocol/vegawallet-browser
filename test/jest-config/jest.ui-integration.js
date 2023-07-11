import base from './frontend-base.js'

const integrationConfig = {
  ...base,
  testRegex: '(/__tests__/.*|(\\.|/)(integration))\\.tsx?$',
  setupFilesAfterEnv: ['<rootDir>/frontend/test/setupTests.ts', '<rootDir>/frontend/test/setupIntegrationTests.ts']
}

export default integrationConfig
