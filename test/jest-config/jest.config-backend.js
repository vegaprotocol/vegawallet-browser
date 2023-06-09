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
        outputDirectory: './test-reports',
        outputName: 'backend-test-results.xml'
      }
    ]
  ],
  transformIgnorePatterns: ['/node_modules/(?!(@vegaprotocol)/protos)/']
}
