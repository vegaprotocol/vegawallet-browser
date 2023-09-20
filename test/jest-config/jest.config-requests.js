import backendConfig from './jest.config-backend.js'
import cloneDeep from 'lodash/cloneDeep.js'
import merge from 'lodash/merge.js'

const generateRequestsConfig = cloneDeep(backendConfig)

let overrides = {
  reporters: [
    'default',
    [
      'jest-junit',
      {
        outputName: 'request-test-results'
      }
    ]
  ]
}

merge(generateRequestsConfig, overrides)
export default generateRequestsConfig;
  