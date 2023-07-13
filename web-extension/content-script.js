import { isRequest, isNotification } from '../lib/json-rpc.js'

const runtime = globalThis.browser?.runtime ?? globalThis.chrome?.runtime

// Inject in-page script
const doc = document.head ?? document.documentElement
const script = document.createElement('script')
script.setAttribute('async', 'false')
// This also works in firefox!
script.src = runtime.getURL('in-page.js')
doc.insertBefore(script, doc.children[0])
doc.removeChild(script)

// Connection happens on first message which handles reconnects also
let backgroundPort

window.addEventListener('message', onwindowmessage, false)

const isManifestV3 = runtime.getManifest().manifest_version === 3

// This timeout stops the keepAliveInterval. This will effectively
// put the extension to sleep after 45 minutes of inactivity.
let keepAliveTimeout

// This interval sends a ping to the background every second to
// prevent the extension from going to sleep.
let keepAliveInterval

// Start the loop. This code is strongly inspired by Metamask's
// implementation: https://github.com/MetaMask/metamask-extension/blob/develop/app/scripts/contentscript.js#L133
keepAlive()
function keepAlive() {
  // Only applicable to manifest v3 (ie chromium based browsers)
  if (isManifestV3) return

  // Refresh the keepalive timeout
  clearTimeout(keepAliveTimeout)
  keepAliveTimeout = setTimeout(() => {
    clearInterval(keepAliveInterval)
    keepAliveInterval = null
    keepAliveTimeout = null
  }, 1000 * 60 * 45)

  if (keepAliveInterval != null) return
  keepAliveInterval = setInterval(() => {
    if (backgroundPort == null) connect()
    backgroundPort.postMessage({ jsonrpc: '2.0', method: 'ping', params: null })
  }, 1000)
}

function connect() {
  backgroundPort = runtime.connect({ name: 'content-script' })
  backgroundPort.onMessage.addListener(onbackgroundmessage)
  backgroundPort.onDisconnect.addListener(onbackgrounddisconnect)
}

// Relay requests from page to background
function onwindowmessage(event) {
  if (event.source !== window) return
  const data = event.data

  // Only react to requests and notifications
  if (!isNotification(data) && !isRequest(data)) return

  if (backgroundPort == null) connect()

  keepAlive() // refresh keepalive on each message
  backgroundPort.postMessage(data)
}

// Relay replies from background to page
function onbackgroundmessage(message) {
  window.postMessage(message, '*')
}

function onbackgrounddisconnect() {
  backgroundPort.onMessage.removeListener(onbackgroundmessage)
  backgroundPort.onDisconnect.removeListener(onbackgrounddisconnect)
  backgroundPort = null
}
