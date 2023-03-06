const runtime = (globalThis.browser?.runtime ?? globalThis.chrome?.runtime)

// Inject in-page script
const doc = document.head ?? document.documentElement
const script = document.createElement('script')
script.setAttribute('async', 'false')
// This also works in firefox!
script.src = runtime.getURL('/in-page.js')
doc.insertBefore(script, doc.children[0])
doc.removeChild(script)


const backgroundPort = runtime.connect({ name: 'content-script' })

// Relay replies from background to page
backgroundPort.onMessage.addListener(message => {
  window.postMessage(message, '*')
})

// Relay requests from page to background
window.addEventListener('message', function (event) {
  if (event.source !== window) return
  const data = event.data

  const isNotification = data.jsonrpc === '2.0' && 'method' in data
  const isRequest = isNotification && data.id != null

  // Only react to requests and notifications
  if (!isNotification && !isRequest) return

  backgroundPort.postMessage(data)
}, false)
