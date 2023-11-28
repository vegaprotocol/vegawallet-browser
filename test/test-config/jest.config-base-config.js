const baseConfig = {
  rootDir: '../..',
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
    '^.+\\.jsx?$': 'ts-jest'
  },
  testEnvironment: 'jest-environment-node',
  testTimeout: 30000,
  reporters: [
    'default',
    [
      'jest-junit',
      {
        outputDirectory: './test/test-reports',
        outputName: 'override-me.xml'
      }
    ]
  ],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  moduleNameMapper: {
    '!/config': '<rootDir>/config/test.js',
    '@/(.*)': '<rootDir>/frontend/$1'
  }
}

export default baseConfig
