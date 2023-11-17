
import jestConfigE2E from "./jest.config-e2e.js";
import cloneDeep from 'lodash/cloneDeep.js'
import merge from 'lodash/merge.js'

const jestConfigConsoleSmoke = cloneDeep(jestConfigE2E)

let overrides = {
  roots: ['<rootDir>/test/console-smoke'],
  moduleNameMapper: {
    '!/config': `<rootDir>/config/console-smoke-${process.env.ENV}.js`
  },
  reporters: [
    'default',
    [
      'jest-junit',
      {
        outputName: `console-smoke-test-${process.env.ENV}-results.xml`
      }
    ]
  ]
}

export default merge(jestConfigConsoleSmoke, overrides)
