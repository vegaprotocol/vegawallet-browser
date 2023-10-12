import { createReadStream, createWriteStream } from 'fs';
import csv from 'csv-parser';
import path from 'path';

function parseCSV(filePath) {
  return new Promise((resolve, reject) => {
    const data = [];

    createReadStream(filePath)
      .pipe(csv())
      .on('data', (row) => {
        data.push(row);
      })
      .on('end', () => {
        resolve(data);
      })
      .on('error', (error) => {
        reject(error);
      });
  });
}

async function compareCoverage(oldCoverage, newCoverage, outputLogFile) {
  const data1 = await parseCSV(oldCoverage);
  const data2 = await parseCSV(newCoverage);

  const decreasedCoverage = [];
  const increasedCoverage = [];
  const newSpecs = [];

  data1.forEach((row1) => {
    const matchingRow2 = data2.find((row2) => row1.File === row2.File);
    if (matchingRow2) {
      const coverage1 = parseFloat(row1.Coverage);
      const coverage2 = parseFloat(matchingRow2.Coverage);
      const coverageDiff = coverage2 - coverage1;

      if (coverageDiff > 0) {
        increasedCoverage.push({ file: row1.File, change: coverageDiff });
      } else if (coverageDiff < 0) {
        decreasedCoverage.push({ file: row1.File, change: -coverageDiff });
      }
    }
  });

  data2.forEach((row2) => {
    const matchingRow1 = data1.find((row1) => row2.File === row1.File);
    if (!matchingRow1) {
      newSpecs.push({ file: row2.File, coverage: parseFloat(row2.Coverage) });
    }
  });

  const reportContent = [];

  if (decreasedCoverage.length > 0) {
    reportContent.push('Decreased in coverage (by percent):');
    decreasedCoverage.forEach((change) => {
      reportContent.push(`${change.file} by ${change.change.toFixed(2)}%`);
    });
  }

  if (increasedCoverage.length > 0) {
    reportContent.push('\nIncreased in coverage (by percent):');
    increasedCoverage.forEach((change) => {
      reportContent.push(`${change.file} by ${change.change.toFixed(2)}%`);
    });
  }

  if (newSpecs.length > 0) {
    reportContent.push('\nNew specs and coverage (by percent):');
    newSpecs.forEach((spec) => {
      reportContent.push(`${spec.file} ${spec.coverage}% coverage`);
    });
  }

  if (decreasedCoverage.length > 0) {
    reportContent.push("\n\n-------------\nWARNING: You have files with decreased AC. This should not be happening. Please investigate the following files:");
    decreasedCoverage.forEach((change) => {
      reportContent.push(change.file);
    });
  }

  if (decreasedCoverage.length === 0 && increasedCoverage.length === 0) {
    reportContent.push("There are no changes to AC coverage");
  }

  const outputLogStream = createWriteStream(outputLogFile, { flags: 'w' });
  outputLogStream.write(reportContent.join('\n'));
  outputLogStream.end();
}

const oldCoverage = path.resolve(process.cwd(), process.argv[2]); 
const newCoverage = path.resolve(process.cwd(), process.argv[3]); 
const outputLogFile = 'approbation-diff.txt'; 

if (!oldCoverage || !newCoverage) {
  console.error('Usage: node compareCoverage.js <oldCoverage.csv> <newCoverage.csv>');
} else {
  compareCoverage(oldCoverage, newCoverage, outputLogFile);
  console.log(`Report saved to ${outputLogFile}`);
}
