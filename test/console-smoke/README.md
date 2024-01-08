# Console smoke tests

### What do we test here?
We test console and wallet in an integrated environment. Our focus here is to validate the integration of the browser wallet with console. It's important to note that these tests don't primarily assess the console itself or the wallet, instead they specifically target key workflows to ensure effective communication between console and the wallet. Tests for product-specific functionalities should be conducted separately.

### Deployment of Browser Wallet and Console

See below for the deployment configuration for browser wallet:  
[mainnet](../../config/console-smoke-mainnet.js)  
[testnet](../../config/console-smoke-testnet.js)   
Bear in mind the above configurations expand upon a base configuration. 

The configuration for console deployment is hardcoded into the script [here](../../.github/scripts/deployment/deploy_console.sh), this script deploys console.

### Local env setup
  
You will need selenium webdriver installed. Follow setup instructions [here](https://www.browserstack.com/guide/run-selenium-tests-using-selenium-chromedriver). You will also need docker configured on your machine.  
Set [env.local](../../.env.local) at the root of the project up with valid recovery phrases. For the testnet run you will need the key associated with the mnemonic to have test assets allocated that correspond with the market tested against. See [test code for the asset you will need](console-smoke.spec.ts)

### Running the tests
You will first need to build a testnet or mainnet instance of the wallet, e.g:  

`yarn build:console:testnet`  

Run the tests using one of the following commands  
`yarn test:console:mainnet:ci`  
`yarn test:console:testnet:ci`

The above commands will spin up a docker container with console and then tear it down after the test run.  
To run against an already running local instance of console run one of the following, this will not perform any deployment related actions:  
`yarn test:console:mainnet`  
`yarn test:console:testnet`