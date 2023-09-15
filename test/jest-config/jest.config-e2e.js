import baseConfig from './base-config.js'

const jestConfigE2E = (projectRoot = 'test', testReportName = `bob-e2e-test-results`) => {
  return {
    ...baseConfig(projectRoot, testReportName),
    setupFilesAfterEnv: ['<rootDir>/test/e2e/setupTests.ts'],
    preset: 'ts-jest',
    testEnvironment: 'node',
  };
};


export default jestConfigE2E;

// const jestConfigE2E = {
//   rootDir: '../..',
//   roots: ['<rootDir>/test'],
//   transform: {
//     '^.+\\.tsx?$': 'ts-jest',
//     '^.+\\.jsx?$': 'ts-jest'
//   },
//   preset: 'ts-jest',
//   testEnvironment: 'node',
//   testTimeout: 120000,
//   setupFilesAfterEnv: ['<rootDir>/test/e2e/setupTests.ts'],
//   reporters: [
//     'default',
//     [
//       'jest-junit',
//       {
//         outputDirectory: './test/test-reports',
//         outputName: `${process.env.BROWSER}-e2e-test-results.xml`
//       }
//     ]
//   ],
//   moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
//   moduleNameMapper: {
//     '!/config': '<rootDir>/config/test.js'
//   }
// }

// export default jestConfigE2E
