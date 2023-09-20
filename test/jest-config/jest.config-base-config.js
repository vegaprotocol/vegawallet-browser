const baseConfig =  {
      rootDir: '../..',
      roots: ['<rootDir>/test'],
      transform: {
        '^.+\\.tsx?$': 'ts-jest',
        '^.+\\.jsx?$': 'ts-jest',
      },
      testEnvironment: 'jest-environment-node',
      testTimeout: 30000,
      reporters: [
        'default',
        [
          'jest-junit',
          {
            outputDirectory: './test/test-reports',
            outputName: 'override-me.xml',
          },
        ],
      ],
      transformIgnorePatterns: ['/node_modules/(?!(@vegaprotocol)/protos)/'],
      // moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
      // moduleNameMapper: {
      //   '!/config': '<rootDir>/config/test.js',
      // },
    };
  
  export default baseConfig;