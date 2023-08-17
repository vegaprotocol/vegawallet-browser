export default {
  rootDir: '../..',
  roots: ['<rootDir>/web-extension'],
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
    '^.+\\.jsx?$': 'ts-jest'
  },
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
  setupFiles: ['jest-webextension-mock', './web-extension/test/setup-tests.js'],
  collectCoverageFrom: ['**/*.js', '!**/node_modules/**'],
  coverageDirectory: 'coverage/backend',
  coverageReporters: ['html', 'lcov'],
  transformIgnorePatterns: ['/node_modules/(?!(@vegaprotocol)/protos)/'],
  moduleNameMapper: {
    '!/config': '<rootDir>/config/test.js'
  }
}
