export const sanitizeEvent = (event, walletNames, publicKeys) => {
  let eventString = JSON.stringify(event)
  walletNames.forEach((name) => {
    eventString = eventString.replace(name, '[WALLET_NAME]')
  })
  publicKeys.forEach((key) => {
    eventString = eventString.replace(key, '[VEGA_KEY]')
  })
  const sanitizedEvent = JSON.parse(eventString)
  return sanitizedEvent
}
