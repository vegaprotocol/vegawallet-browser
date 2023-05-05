# Minimal Extension

> This is minimal extension to explore communication between a browser page and
> an extension popup

## Installation

**NOTE** The extension is in active development and may break at any time.
It will not allow you to backup the recovery phrase, and you should regard
all funds transferred to keys that are managed to the extension as lost.

Download a release from [Github Releases](https://github.com/vegaprotocol/vegawallet-browser/releases) and follow one of the guides below:

- [Chrome - Load unpacked extension](https://developer.chrome.com/docs/extensions/mv3/getstarted/development-basics/#load-unpacked)
- [Firefox - Temporary Add-on](https://extensionworkshop.com/documentation/develop/temporary-installation-in-firefox/)

## Usage

The end-user API is available after `window.onload` and has the following
methods exposed on `window`/`globalThis`:

- `await vega.connectWallet()`
- `await vega.disconnectWallet()`
- `await vega.getChainId()`
- `await vega.listKeys()`
- `await vega.sendTransaction({ publicKey, transaction, sendingMode })`

A sample dApp is provided in `examples/sample-dapp/index.html`, and is also
published to Github Pages (see the repo website for a live demo).

Alternatively, end-users can also communicate with the content script directly
using JSON-RPC:

```js
window.addEventListener('message', (event) => {
  // somehow avoid catching own message

  const response = event.data

  if (response.error) return console.error(response.error)

  console.log(response.result)
})

window.postMessage(
  {
    jsonrpc: '2.0',
    id: '1',
    method: 'vega.sendTransaction',
    params: { type, tx }
  },
  '*'
)
```

## Reporting Bugs

Please provide which browser you used and its version, and the output of both
the DevTools console from the dApp used, the error page from the
`about:addons` (FF) / `chrome://extensions/` (Chromium) page and relevant logs
from the background script and popup.
[See this guide for Chromium](https://developer.chrome.com/docs/extensions/mv3/tut_debugging/)
or [this guide for Firefox](https://extensionworkshop.com/documentation/develop/debugging/)

Examples of Chromium based browsers:

- Google Chrome
- Chromium
- Brave

Examples of Firefox based browsers:

- Firefox
- Firefox Nightly
- Firefox Developer Edition

## Structure

The project is built with `webpack`, `create-react-app` and `craco`:

### Development + building

- `build:chrome` / `build:firefox`: Builds the extension in production mode for the respective browser. Outputs to `build/[BROWSER]`.
- `dev:chrome` / `dev:firefox`: Serves the `build/[BROWSER]` directory to develop against the extension. First run `build:[BROWSER]` to build the extension _before_ running this command, or use the `watch` command.
- `watch` Watch for changes in the source code and rebuild the extension in development mode. Can be used with `dev:chrome` / `dev:firefox` to automatically reload the extension when changes are made. You can change the browser this builds for in package.json. Default is `build:chrome`.
- `format` / `lint`: Formats / lints the source code

### Testing

- `test` Runs the unit tests on UI components
- `test:backend` Runs the unit tests on the backend
- `test:e2e:chrome` Runs the e2e tests through `selenium` on Chrome (headed)
- `test:e2e:chrome:ci` Runs the e2e tests through `selenium` on Chrome (headless)

The web extension source code lives in `web-extension/common` with platform
specific artifacts in respectively `web-extension/firefox` and `web-extension/chrome`. All UI components exist in the `src` directory.

The web extension has 4 components:

- `index.html` / `index.js`: This is the source code for the extension popup, rendered using `react`.
- `background.js`: This is the background script that handles all core logic
- `content-script.js`: This script intermediates communication between the web
  page and the background script
- `in-page.js`: This script is injected in the web page to provide a
  higher-level, promise-based API for end-users
