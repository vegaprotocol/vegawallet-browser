export default {
  rootDir: '../..',
  roots: ['<rootDir>/web-extension'],
  testEnvironment: 'jest-environment-node',
  testTimeout: 30000,
  reporters: [
    'default',
    [
      'jest-junit',
      {
        outputDirectory: './test/test-reports',
        outputName: 'backend-test-results.xml'
      }
    ]
  ],
  collectCoverageFrom: ['**/*.js', '!**/node_modules/**'],
  coverageDirectory: 'coverage/backend',
  coverageReporters: ['html'],
  transformIgnorePatterns: ['/node_modules/(?!(@vegaprotocol)/protos)/'],
  moduleNameMapper: {
    '!/config': '<rootDir>/config/test.js'
  }
}
