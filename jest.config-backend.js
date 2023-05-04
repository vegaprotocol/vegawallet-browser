module.exports = {
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
  roots: ['./web-extension/']
}
