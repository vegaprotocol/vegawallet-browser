import path from 'path';
import { readFileSync, writeFileSync } from 'fs';

function rebuildLcovFilePaths(coverageFilePath) {
  const scriptUrl = new URL(import.meta.url);
  const scriptDir = path.dirname(scriptUrl.pathname);
  const lcovFile = path.resolve(scriptDir, coverageFilePath);
  const rawFile = readFileSync(lcovFile, 'utf8');
  const rebuiltPaths = rawFile
    .split('\n')
    .map((singleLine) => {
      if (singleLine.startsWith('SF:')) {
        return singleLine.replace('SF:', `SF:${scriptDir}/`);
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
