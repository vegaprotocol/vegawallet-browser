import { execSync } from 'child_process';

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

async function main(configPath) {
  try {
    const configModule = await import(configPath);
    const urls = configModule.default.network.rest;

    for (const url of urls) {
      const version = await getVersion(url);
      if (version !== null) {
        console.log(`${version}`);
        break;
      }
    }
  } catch (error) {
    console.error(`Error: ${error.message}`);
  }
}

const configPath = process.argv[2]; // Assuming the path is provided as a command-line argument
main(configPath);
