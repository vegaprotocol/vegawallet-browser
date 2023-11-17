# Console smoke tests

**Essential setup**
Set env.local at the root of the project up with valid recovery phrases. For the testnet run you will need the key associated with the mnemonic to have test assets allocated that correspond with the market tested against. See [test code for the asset you will need](console-smoke.spec.ts)

Run using one of the following commands  
`yarn test:console:mainnet:ci`  
`yarn test:console:testnet:ci`

The above commands will spin up a docker container with console and then tear it down after the test run.  
To run against an already running local instance of console run one of the following:  
`yarn test:console:mainnet`  
`yarn test:console:testnet`

If you want to drill into the specifics of the deployment of console for debugging or configuration, you can find the scripts [in here](../../.github/scripts/deployment/)
