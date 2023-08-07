import { isRequest, isNotification } from '../lib/json-rpc.js'
import createKeepAlive from '../lib/mv3-keep-alive.js'

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

const keepAlive = createKeepAlive()

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

  // TODO: We could filter out different types of messages here like metamask does,
  // where only user "initiated" messages cause the keep-alive loop to refresh
  keepAlive(backgroundPort) // refresh keepalive on each message
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
  keepAlive(null) // stop keepalive
}

connect()
