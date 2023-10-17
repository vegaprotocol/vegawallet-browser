
import jestConfigE2E from "./jest.config-e2e.js";
import cloneDeep from 'lodash/cloneDeep.js'
import merge from 'lodash/merge.js'

const jestConfigConsoleSmoke = cloneDeep(jestConfigE2E)

let overrides = {
roots: ['<rootDir>/test/upgrade-tests'],
  reporters: [
    'default',
    [
      'jest-junit',
      {
        outputName: `upgrade-test-results.xml`
      }
    ]
  ]
}

export default merge(jestConfigConsoleSmoke, overrides)
