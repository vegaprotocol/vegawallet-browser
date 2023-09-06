import jestConfigE2E from "./jest.config-e2e.js";

const jestConsoleE2e = { ...jestConfigE2E }; 
jestConsoleE2e.reporters = [
  'default',
  [
    'jest-junit',
    {
      outputDirectory: './test/test-reports',
      outputName: 'console-smoke-test-results.xml'
    }
  ]
];

export default jestConsoleE2e;
