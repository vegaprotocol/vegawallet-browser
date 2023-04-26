/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  collectCoverage: true,
  collectCoverageFrom: ['**/*.{ts,tsx}', '!**/node_modules/**'],
  coverageReporters: ['html']
  testTimeout: 30000,
  reporters: [
    "default",
    [
      "jest-junit", 
      {
        outputDirectory: "./test-reports",
        outputName: "test-results.xml",
      },
    ],
  ]
}
