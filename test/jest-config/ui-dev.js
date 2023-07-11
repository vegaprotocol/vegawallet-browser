import base from './frontend-base.js'

const devConfig = {
  ...base,
  testRegex: '(/__tests__/.*|(\\.|/)(integration|unit|spec|test))\\.tsx?$',
  coverageDirectory: 'coverage/frontend',
  coverageReporters: ['html', 'json'],
  setupFilesAfterEnv: ['<rootDir>/frontend/test/setupTests.ts', '<rootDir>/frontend/test/setupIntegrationTests.ts'],
  coverageThreshold: {
    global: {
      branches: 98,
      functions: 99.5,
      lines: 100,
      statements: 100
    }
  }
}

export default devConfig
