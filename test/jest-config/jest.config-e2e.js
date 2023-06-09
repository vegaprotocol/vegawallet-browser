/** @type {import('ts-jest').JestConfigWithTsJest} */
export default {
  rootDir: '../..',
  roots: ['<rootDir>/test'],
  preset: 'ts-jest',
  testEnvironment: 'node',
  testTimeout: 120000,
  setupFilesAfterEnv: ['jest-expect-message'],
  reporters: [
    'default',
    [
      'jest-junit',
      {
        outputDirectory: './test-reports',
        outputName: `${process.env.BROWSER}-e2e-test-results.xml`
      }
    ]
  ]
}
