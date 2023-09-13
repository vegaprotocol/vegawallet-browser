declare module '!/config' {
  export interface Config {
    network: Network
    feedbackLink: string
    encryptionSettings: EncryptionSettings
    closeWindowOnPopupOpen: boolean
    sentryDsn: string | undefined
    logging: boolean
    userDataPolicy: string
    showDisclaimer: boolean
    features:
      | {
          [key: string]: boolean
        }
      | undefined
    autoOpenOnInstall: boolean
  }

  export interface Network {
    name: string
    rest: string[]
    console: string
    explorer: string
    ethereumExplorerLink: string
    governance: string
    vegaDapps: string
    docs: string
  }

  export interface EncryptionSettings {
    memory: number
    iterations: number
  }
  const config: Config

  export default config
}
