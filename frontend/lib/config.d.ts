declare module '@config' {
  export interface Config {
    network: Network
    feedbackLink: string
    encryptionSettings: EncryptionSettings
    closeWindowOnPopupOpen: boolean
  }

  export interface Network {
    name: string
    rest: string[]
    console: string
    explorer: string
  }

  export interface EncryptionSettings {
    memory: number
    iterations: number
  }
  const config: Config

  export default config
}
