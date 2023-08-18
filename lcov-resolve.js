const path = require('path');
const { readFileSync, writeFileSync } = require('fs');

function rebuildLcovFilePaths(coverageFilePath) {
  const lcovFile = path.resolve(__dirname, coverageFilePath);
  const rawFile = readFileSync(lcovFile, 'utf8');
  const rebuiltPaths = rawFile
    .split('\n')
    .map((singleLine) => {
      if (singleLine.startsWith('SF:')) {
        return singleLine.replace('SF:', `SF:${__dirname}/`);
      }
      return singleLine;
    })
    .join('\n');
  
  writeFileSync(lcovFile, rebuiltPaths, 'utf8');
}

// Rebuild paths for frontend coverage
rebuildLcovFilePaths('./coverage-frontend/lcov.info');

// Rebuild paths for backend coverage
rebuildLcovFilePaths('./coverage-backend/lcov.info');
