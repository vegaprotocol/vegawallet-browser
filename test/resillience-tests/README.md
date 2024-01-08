# Resilience Tests

### What do we test here?
These tests aim to verify the resilience of the browser wallet when faced with dependency failures, such as a complete network outage or unavailability of an external API endpoint. The objective is to ensure that the browser wallet remains stable in such scenarios—it should not crash but rather display relevant errors and continue functioning without interruption

## Essential setup  
You will need selenium webdriver installed. Follow setup instructions [here](https://www.browserstack.com/guide/run-selenium-tests-using-selenium-chromedriver).
  

### Running the tests
Build the wallet  
`yarn build:test-e2e`

Run using the following command  
`yarn test:resillience`
