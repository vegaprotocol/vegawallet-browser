/**
 * Initialise a keep-alive loop for manifest v3 extensions. For any other manifest version, a noop is returned,
 * duck typing to the same function signature.
 *
 * @param {number} [sleep=45 * 60 * 1000] - The number of milliseconds to wait before stopping the keep-alive loop.
 * @param {number} [ping=1000] - The number of milliseconds to wait between keep-alive heartbeats.
 * @returns {function} - A function to call to keep the extension alive, by resetting the sleep timeout.
 */
export default function init(sleep = 45 * 60 * 1000, ping = 1000) {
  const runtime = globalThis.browser?.runtime ?? globalThis.chrome?.runtime
  const isManifestV3 = runtime.getManifest().manifest_version === 3
  // Only applicable to manifest v3 (ie chromium based browsers)
  // Other browsers will get a noop
  if (isManifestV3 === false) return () => {}

  // This timeout stops the keepAliveInterval. This will effectively
  // put the extension to sleep after N minutes of inactivity.
  let keepAliveTimeout

  // This interval sends a ping to the port every M seconds to
  // prevent the extension from going to sleep.
  let keepAliveInterval

  // Start the loop. This code is strongly inspired by Metamask's
  // implementation: https://github.com/MetaMask/metamask-extension/blob/develop/app/scripts/contentscript.js#L133

  /**
   * Reset the sleep and ping timeouts. You should call this function each time you interact with the
   * extension in any way that the user expects it to be kept alive. Eg. when sending user initiated messages,
   * when interacting with UI, etc.
   *
   * @param {MessagePort} port - The port to send the ping to. If null, the keep-alive loop will be stopped.
   * @returns {void}
   */
  return function keepAlive(port) {
    console.log('keep alive')
    // Refresh the keepalive timeout
    clearTimeout(keepAliveTimeout)
    // Restart the keepalive interval
    clearInterval(keepAliveInterval)

    // If the port is null, we cannot send a ping, so stop here
    if (port == null) return

    keepAliveTimeout = setTimeout(() => {
      clearInterval(keepAliveInterval)
      keepAliveInterval = null
      keepAliveTimeout = null
    }, sleep)

    keepAliveInterval = setInterval(() => {
      try {
        console.log('ping')
        port.postMessage({ jsonrpc: '2.0', method: 'ping', params: null })
      } catch (error) {
        // The port is disconnected, stop timers
        clearInterval(keepAliveInterval)
        clearTimeout(keepAliveTimeout)
      }
    }, ping)

    return { keepAliveTimeout, keepAliveInterval }
  }
}
