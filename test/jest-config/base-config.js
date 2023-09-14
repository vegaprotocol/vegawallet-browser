const baseConfig = (projectRoot, reportName) => {
    if (!projectRoot || !reportName) {
      throw new Error("Both 'projectRoot' and 'reportName' must be provided.");
    }
  
    return {
      rootDir: '../..',
      roots: ['<rootDir>/' + projectRoot],
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
            outputName: reportName + '.xml',
          },
        ],
      ],
      transformIgnorePatterns: ['/node_modules/(?!(@vegaprotocol)/protos)/'],
      moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
      moduleNameMapper: {
        '!/config': '<rootDir>/config/test.js',
      },
    };
};

export default baseConfig