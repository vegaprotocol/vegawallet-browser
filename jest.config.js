/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testTimeout: 30000,
  reporters: [
    "default", // use the default reporter
    [
      "jest-junit", // use the junit reporter
      {
        outputDirectory: "./test-reports", // specify the directory where the report will be generated
        outputName: "test-results.xml", // specify the filename of the report
      },
    ],
  ],
}
