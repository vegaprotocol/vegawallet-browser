/** @type {import('ts-jest').JestConfigWithTsJest} */
export default {
  rootDir: '../..',
  roots: ['<rootDir>/test'],
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
    '^.+\\.jsx?$': 'ts-jest'
  },
  preset: 'ts-jest',
  testEnvironment: 'node',
  testTimeout: 120000,
  setupFilesAfterEnv: ['<rootDir>/test/e2e/setupTests.ts'],
  reporters: [
    'default',
    [
      'jest-junit',
      {
        outputDirectory: './test/test-reports',
        outputName: `${process.env.BROWSER}-e2e-test-results.xml`
      }
    ]
  ],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  moduleNameMapper: {
    '@/config': '<rootDir>/config/test.js'
  }
}
