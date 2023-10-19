import fetch from 'node-fetch';
import smokeConsoleTestnet from '../../../config/console-smoke-testnet.js';
import smokeConsoleMainnet from '../../../config/console-smoke-mainnet.js';

const networkArg = process.argv[2];

const PERMITTED_NETWORKS = ['testnet', 'mainnet']
if (!PERMITTED_NETWORKS.includes(networkArg)) {
  console.error(`Usage: network must be provided and must be one of ${PERMITTED_NETWORKS.join(' ')}`);
  process.exit(1);
}

const endpointUrl = networkArg === 'testnet' ? smokeConsoleTestnet.network.console : smokeConsoleMainnet.network.console;

const timeoutDuration = 60 * 1000;

const pollEndpoint = async () => {
  try {
    const response = await fetch(endpointUrl);

    if (response.status === 200) {
      console.log(`Endpoint (${networkArg}) is healthy!`);
      process.exit(0);
    } else {
      throw new Error(`Received status code ${response.status}`);
    }
  } catch (error) {
    console.error(`Failed to fetch endpoint: ${error.message}`);
    setTimeout(poll, pollInterval);
  }
};

const pollInterval = 1000;
const startTime = Date.now();

const poll = () => {
  const currentTime = Date.now();
  if (currentTime - startTime >= timeoutDuration) {
    console.error('Timeout: Endpoint health check failed');
    process.exit(1);
  }

  pollEndpoint();
};

poll();
