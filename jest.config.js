/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
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
