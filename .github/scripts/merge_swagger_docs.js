import { execSync } from 'child_process';
import { writeFileSync } from 'fs';

const swaggerUrls = [
  'https://raw.githubusercontent.com/vegaprotocol/documentation/main/specs/v0.73.0/core.swagger.json',
  'https://raw.githubusercontent.com/vegaprotocol/documentation/main/specs/v0.73.0/trading_data_v2.swagger.json',
];

// Function to fetch Swagger JSON from a URL using curl
async function fetchSwagger(url) {
  try {
    const curlCommand = `curl -s ${url}`;
    const swaggerJson = execSync(curlCommand, { encoding: 'utf8' });
    return JSON.parse(swaggerJson);
  } catch (error) {
    console.error(`Failed to fetch Swagger from ${url}: ${error.message}`);
    process.exit(1);
  }
}

// Function to merge Swagger documents
async function mergeSwagger() {
  const mergedSwagger = {
    swagger: '2.0',
    info: {
      title: 'Merged Vega Swagger API',
      version: '1.0.0',
    },
    paths: {},
    definitions: {},
    consumes: [], 
    produces: [], 
    host: '',     
  };

  for (const url of swaggerUrls) {
    const swagger = await fetchSwagger(url);

    // Merge paths
    mergedSwagger.paths = { ...mergedSwagger.paths, ...swagger.paths };

    // Merge definitions
    if (swagger.definitions) {
      mergedSwagger.definitions = {
        ...mergedSwagger.definitions,
        ...swagger.definitions,
      };
    }

    // Include 'consumes', 'produces', 'host' from the original Swagger document
    if (swagger.consumes) {
      mergedSwagger.consumes = [...mergedSwagger.consumes, ...swagger.consumes];
    }

    if (swagger.produces) {
      mergedSwagger.produces = [...mergedSwagger.produces, ...swagger.produces];
    }

    if (swagger.host) {
      mergedSwagger.host = swagger.host;
    }
  }

  // Serialize and save the merged Swagger document
  const mergedSwaggerJson = JSON.stringify(mergedSwagger, null, 2);
  writeFileSync('mergedSwagger.json', mergedSwaggerJson);
  console.log('Merged Swagger document saved as mergedSwagger.json');
}

// Call the mergeSwagger function to perform the merge
mergeSwagger();
