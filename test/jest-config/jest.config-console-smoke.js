import jestE2EConfig from './jest.config-e2e.js';

const projectRoot = 'test';
const testReportName = 'console-smoke-test-result';

const generateRequestsConfig = jestE2EConfig(projectRoot, testReportName);

export default generateRequestsConfig;

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
