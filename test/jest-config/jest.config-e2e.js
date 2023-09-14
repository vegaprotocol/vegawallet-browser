import baseConfig from './base-config'

const projectRoot = 'test';
const testReportName = `${process.env.BROWSER}-e2e-test-results`;

const jestConfigE2E = {
  ...baseConfig(projectRoot, testReportName),
  setupFilesAfterEnv: ['<rootDir>/test/e2e/setupTests.ts'],
  
};

export default jestConfigE2E

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
