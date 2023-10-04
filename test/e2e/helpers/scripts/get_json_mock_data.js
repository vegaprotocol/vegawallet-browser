import { writeFileSync, mkdirSync, existsSync } from 'fs';
import { execSync } from 'child_process';
import path from 'path';


const pathsForGetRequest = ['blockchain/height', 'api/v2/accounts', 'api/v2/markets', 'api/v2/assets', 'transaction/raw'];

async function sendGetRequestAndStoreResponse(url) {
  try {
    for (const requestPath of pathsForGetRequest) { // Use a different variable name here
      const response = execSync(`curl -s '${url}/${requestPath}' -H 'content-type: application/json'`);
      let responseData;
      try {
        responseData = JSON.parse(response);
      } catch (error) {
        throw new Error(`Invalid JSON response for ${requestPath}`);
      }

      const fileName = `${requestPath.replace(/\//g, '_')}-vega-responses.json`;
      const directoryPath = path.join('./test/e2e/generated-test-data');
      const filePath = path.join(directoryPath, fileName);

      // Check if the directory exists, and if not, create it
      if (!existsSync(directoryPath)) {
        mkdirSync(directoryPath, { recursive: true });
      }

      writeFileSync(filePath, JSON.stringify(responseData, null, 2, { flag: 'w' }));

      console.log(`Successfully saved response for ${requestPath} to ${filePath}`);
    }
  } catch (error) {
    console.error('Error:', error.message);
  }
}

async function main(configPath) {
  try {
    const configModule = await import(configPath); 
    const urls = configModule.default.network.rest;
    console.log(urls)

    let chosenUrl = null;

    for (const url of urls) {
      try {
        const response = execSync(`curl -s '${url}/blockchain/height' -H 'content-type: application/json'`);
        console.log(response)

        try {
          JSON.parse(response);
          chosenUrl = url;
          break;
        } catch (error) {
          console.error(`Invalid JSON response for ${url}/blockchain/height`);
          continue;
        }
       
      } catch (error) {
        console.error(`Error fetching ${url}: ${error.message}`);
      }
    }

    if (chosenUrl) {
      await sendGetRequestAndStoreResponse(chosenUrl);
    } else {
      console.error('No healthy URL found with a 200 OK response.');
    }

  } catch (error) {
    console.error(`Error: ${error.message}`);
  }
}

const configPath = process.argv[2];
main(configPath);
