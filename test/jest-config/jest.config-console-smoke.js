import baseConfig from './base-config.js'

const projectRoot = 'test';
const testReportName = 'console-smoke-test-result';

const jestConsoleE2E = {
  ...baseConfig(projectRoot, testReportName),
  setupFilesAfterEnv: ['<rootDir>/test/e2e/setupTests.ts'],
  
};

export default jestConsoleE2E

//const jestConsoleE2e = { ...jestConfigE2E }; 
// jestConsoleE2e.reporters = [
//   'default',
//   [
//     'jest-junit',
//     {
//       outputDirectory: './test/test-reports',
//       outputName: 'console-smoke-test-results.xml'
//     }
//   ]
// ];

// export default jestConsoleE2e;
