browser.runtime.onMessage.addListener((message, sender) => {
  if (sender.id === browser.runtime.id) {
    console.log('CONTENTSCRIPT - SENDING RESPONSE...', message)
    window.postMessage(message)
  }
})

window.addEventListener('message', async (event) => {
  console.log('CONTENTSCRIPT - MSG!', event, browser)

  if (
    event.data &&
    event.data.extensionId &&
    event.data.extensionId === browser.runtime.id
  ) {
    console.log('CONTENTSCRIPT - SENDING MSG...')
    const { extensionId, data } = event.data

    browser.runtime.sendMessage(extensionId, data)
  }
})
