import { createBackendConfig } from './backendConfig.js';

const projectRoot = 'web-extension';
const testReportName = 'request-test-results';

const generateRequestsConfig = createBackendConfig(projectRoot, testReportName);

export default generateRequestsConfig;


// import backendConfig from "./jest.config-backend.js";



// const jestRequestsConfig = {
//   ...backendConfig(projectRoot, testReportName),
// };

// export default jestRequestsConfig;

// export default {
//     rootDir: '../..',
//     roots: ['<rootDir>/web-extension'],
//     transform: {
//       '^.+\\.tsx?$': 'ts-jest',
//       '^.+\\.jsx?$': 'ts-jest'
//     },
//     testEnvironment: 'jest-environment-node',
//     testTimeout: 30000,
//     reporters: [
//       'default',
//       [
//         'jest-junit',
//         {
//           outputDirectory: './test/test-reports',
//           outputName: 'request-test-results.xml'
//         }
//       ]
//     ],
//     transformIgnorePatterns: ['/node_modules/(?!(@vegaprotocol)/protos)/'],
//     moduleNameMapper: {
//       '!/config': '<rootDir>/config/test.js'
//     }
//   }
  