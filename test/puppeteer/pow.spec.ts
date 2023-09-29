import puppeteer, { Page, Browser } from 'puppeteer'
import { chromeExtensionURL } from '../e2e/helpers/wallet/common-wallet-values'

describe('Extension Test', () => {
  let browser: Browser
  let page: Page

  beforeAll(async () => {
    browser = await puppeteer.launch({
      headless: 'new',
      args: [`--load-extension=./build/chrome`]
    })
    page = await browser.newPage()
  })

  afterAll(async () => {
    await browser.close()
  })

  it('should load the extension, navigate, and query sources', async () => {
    // Load the unpacked extension
    await page.goto(chromeExtensionURL)
    // Query the DevTools "Sources" panel
    const sources = await page.evaluate(() => {
      // Switch to the DevTools "Sources" panel
      ;(window as any).DevToolsAPI.showPanel('sources')

      // Here, you can interact with the DevTools "Sources" panel as needed
      // For example, you can execute JavaScript code to inspect sources

      // Replace the following code with your specific actions in the DevTools panel
      // ...

      // Return data you need from the DevTools "Sources" panel
      return someData
    })

    console.log(sources) // Output the collected data from the "Sources" panel
  })
})
