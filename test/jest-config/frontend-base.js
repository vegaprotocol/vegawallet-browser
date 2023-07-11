const base = {
  rootDir: '../..',
  roots: ['<rootDir>/frontend'],

  // Jest transformations -- this adds support for TypeScript
  // using ts-jest
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
    '^.+\\.jsx?$': 'ts-jest'
  },
  testEnvironment: 'jsdom',

  // TODO merge coverage reports
  collectCoverageFrom: ['**/*.{ts,tsx}', '!**/node_modules/**', '!test/**', '!**/*.(spec|test|integration).tsx'],
  coverageReporters: ['html'],

  reporters: [
    'default',
    [
      'jest-junit',
      {
        outputDirectory: './test/test-reports',
        outputName: 'unit-test-results.xml'
      }
    ]
  ],

  // Module file extensions for importing
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  moduleNameMapper: {
    '@/config': '<rootDir>/config/test.js'
  }
}

export default base
