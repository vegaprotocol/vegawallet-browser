# Minimal Extension

> This is minimal extension to explore communication between a browser page and
> an extension popup

## Structure

The project is built with `make`:

  - `make clean`: Remove all build artifacts
  - `make dist`: Build extensions for Firefox and Chrome to separate directories
     in `dist/`
  - `make test-firefox`: Build and run `web-ext` for Firefox using a sample page
  - `make test-chrome`: Build and run `web-ext` for Chromium  using a sample page

Alternatively the extensions can be built with `npm run build`

The web extension source code lives in `web-extension/common` with platform
specific artifacts in respectively `web-extension/firefox` and `web-extension/chrome`.

The web extension has 4 components:

- `index.html` / `index.js`: This is the source code for the extension popup
- `background.js`: This is the background script that handles all core logic
- `content-script.js`: This script intermediates communication between the web
   page and the background script
- `in-page.js`: This script is injected in the web page to provide a
   higher-level, promise-based API for end-users

The end-user API is available after `window.onload` and has the following
methods exposed on `window`/`globalThis`:

- `await vega.sendTransaction(params)`

Alternatively, end-users can also communicate with the content script directly
using JSON-RPC:

```js
window.addEventListener('message', event => {
  // somehow avoid catching own message

  const response = event.data

  if (response.error) return console.error(response.error)

  console.log(response.result)
})

window.postMessage({
  jsonrpc: '2.0',
  id: '1',
  method: 'vega.sendTransaction',
  params: { type, tx }
}, '*')
```
