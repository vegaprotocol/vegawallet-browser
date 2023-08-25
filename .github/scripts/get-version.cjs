const { execSync } = require('child_process');

async function getVersion(url) {
  try {
    const response = execSync(`curl -s '${url}/graphql' -H 'content-type: application/json' --data-raw '{"query":"{ statistics { appVersion } }"}'`);
    const parsedResponse = JSON.parse(response);
    const appVersion = parsedResponse.data.statistics.appVersion;
    return appVersion;
  } catch (error) {
    console.error(`Error fetching version from ${url}: ${error.message}`);
    return null;
  }
}

async function main() {
  const arg = process.argv[2]; // Get the command line argument
  let urls;

  if (arg === 'mainnet') {
    const mainnetModule = await import('../../config/mainnet.js');
    urls = mainnetModule.default.network.rest;
  } else if (arg === 'fairground') {
    urls = ['http://localhost:8080'];
  } else {
    console.error('Invalid argument. Usage: node get-version.cjs mainnet|fairground');
    return;
  }

  for (const url of urls) {
    const version = await getVersion(url);
    if (version !== null) {
      console.log(`${version}`);
      break;
    }
  }
}

main();
