/* eslint-disable */
export default {
  displayName: 'wallet-ui',
  preset: '../../jest.preset.js',
  globals: {
    'ts-jest': {
      tsconfig: '<rootDir>/tsconfig.spec.json',
    },
  },
  transform: {
    '^.+\\.[tj]sx?$': 'ts-jest',
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
  coverageDirectory: '../../coverage/libs/wallet-ui',
  setupFilesAfterEnv: ['./src/test/setup-tests.ts'],
}
