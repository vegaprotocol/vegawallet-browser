import jestConfigE2E from "./jest.config-e2e.js";
import cloneDeep from 'lodash/cloneDeep.js'
import merge from 'lodash/merge.js'

const jestUpgradeTests = cloneDeep(jestConfigE2E)

let overrides = {
roots: ['<rootDir>/test/resillience-tests'],
setupFilesAfterEnv: ['<rootDir>/test/e2e/setupTests.ts'],
  reporters: [
    'default',
    [
      'jest-junit',
      {
        outputName: `resillience.xml`
      }
    ]
  ]
}
export default merge(jestUpgradeTests, overrides)