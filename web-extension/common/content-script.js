const runtime = (globalThis.browser?.runtime ?? globalThis.chrome?.runtime)

// Inject in-page script
const doc = document.head ?? document.documentElement
const script = document.createElement('script')
script.setAttribute('async', 'false')
// This also works in firefox!
script.src = runtime.getURL('/in-page.js')
doc.insertBefore(script, doc.children[0])
doc.removeChild(script)

// Connection happens on first message which handles reconnects also
let backgroundPort

window.addEventListener('message', onwindowmessage, false)

// Relay requests from page to background
function onwindowmessage (event) {
  if (event.source !== window) return
  const data = event.data

  const isNotification = data.jsonrpc === '2.0' && 'method' in data
  const isRequest = isNotification && data.id != null

  // Only react to requests and notifications
  if (!isNotification && !isRequest) return

  if (backgroundPort == null) {
    backgroundPort = runtime.connect({ name: 'content-script' })
    backgroundPort.onMessage.addListener(onbackgroundmessage)
    backgroundPort.onDisconnect.addListener(onbackgrounddisconnect)
  }

  backgroundPort.postMessage(data)
}

// Relay replies from background to page
function onbackgroundmessage (message) {
  window.postMessage(message, '*')
}

function onbackgrounddisconnect () {
  backgroundPort.onMessage.removeListener(onbackgroundmessage)
  backgroundPort.onDisconnect.removeListener(onbackgrounddisconnect)
  backgroundPort = null
}
