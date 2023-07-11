export const sanitizeEvent = (event, wallets) => {
  const eventString = JSON.stringify(event)
  wallets.forEach((wallet) => {
    eventString.replace(wallet.name, '[WALLET_NAME]')
    wallet.keys.forEach((key) => {
      eventString.replace(key.publicKey, '[VEGA_KEY]')
    })
  })
  const sanitizedEvent = JSON.parse(eventString)
  return sanitizedEvent
}
