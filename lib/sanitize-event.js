export const sanitizeEvent = (event, wallets) => {
  let eventString = JSON.stringify(event)
  wallets.forEach((wallet) => {
    eventString = eventString.replace(wallet.name, '[WALLET_NAME]')
    wallet.keys.forEach((key) => {
      eventString = eventString.replace(key.publicKey, '[VEGA_KEY]')
    })
  })
  const sanitizedEvent = JSON.parse(eventString)
  return sanitizedEvent
}
