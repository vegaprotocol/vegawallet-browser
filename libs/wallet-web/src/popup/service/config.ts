import { z } from 'zod'
import { Storage } from '@vegaprotocol/wallet-service'

const getStorage = ():
  | typeof chrome.storage.local
  | typeof browser.storage.local => {
  if (typeof browser !== 'undefined') {
    return browser.storage.local
  }

  if (typeof chrome !== 'undefined') {
    return chrome.storage.local
  }

  throw new Error(
    'Unsupported platform, both "chrome" or "browser" is unavailable in the global namespace.'
  )
}

export const APP_CONFIG_KEY = 'app-config'

const AppConfigSchema = z
  .object({
    logLevel: z.string(),
    vegaHome: z.string(),
    defaultNetwork: z.string(),
    telemetry: z
      .object({
        consentAsked: z.boolean(),
        enabled: z.boolean(),
      })
      .required(),
  })
  .required()

const storage = getStorage()

export const AppConfigStorage = new Storage(
  APP_CONFIG_KEY,
  AppConfigSchema,
  storage
)
