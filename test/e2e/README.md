# E2E Test Framework

## What do we test here?
The focus here should not be exhaustively testing things like boundaries and extensive validation linked to a single module, that should be tested 'lower down' in unit tests. These tests should simply 'touch' the logic tested at unit/integration level to check that the logic will hold true in an integrated environment. The specifics of this should be discussed on a feature by feature basis. Put simply, these tests should check the 'wiring' and user level flows.

## Running the tests
### Setup
To run the tests, ensure you have chromedriver installed. You can follow the instructions in our CI setup script [here](../../.github/scripts/install_chromedriver.sh)  or manually install it using [these instructions](https://www.browserstack.com/guide/run-selenium-tests-using-selenium-chromedriver)

### Running the tests
Execute the following commands:
``` 
yarn
yarn build:test-e2e
```

After doing the above you should be able to test in either chrome or firefox by doing the following

```
yarn test:e2e:chrome
```

OR..

```
yarn test:e2e:firefox
```

To run in headless mode you can run either of the below commands
```
yarn test:e2e:chrome:ci
yarn test:e2e:firefox:ci
```

### Test Deployment Scope
The browser wallet's test deployment doesn't integrate with genuine dependencies like core or console. Running the E2E test build outside of the testing environment may generate errors due to missing external dependencies (e.g., viewing key details and accessing asset balances). However, during the test run, we utilize a mock HTTP server to fulfill these dependencies. This prevents test failures caused by node outages or bugs in external apps. The server's configuration can be viewed [here](./helpers/wallet/http-server.ts).  It's set up and torn down before each test, as detailed [here](./setupMocks.ts)

### CI Gotcha
Remeber that on test failure CI outputs test screenshots as an artifact. For more information on the CI workflow, see [here](../../.github/workflows/e2e-tests.yml)