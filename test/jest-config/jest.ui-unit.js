import base from './frontend-base.js'

const unitConfig = {
  ...base,
  coverageDirectory: 'coverage/frontend/unit',
  testRegex: '(/__tests__/.*|(\\.|/)(unit|spec|test))\\.tsx?$',
  setupFilesAfterEnv: ['<rootDir>/frontend/test/setupTests.ts', '<rootDir>/frontend/test/setupUnitTests.ts']
}

export default unitConfig
