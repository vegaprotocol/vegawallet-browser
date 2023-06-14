declare module 'config' {
  interface Config {
    ENV_ID: string
    ENV_NAME: string
    DEPOSIT_LINK: string
    EXPLORER_URL: string
    FEEDBACK_LINK: string
    NODES: string[]
    LIGHT_ENCRYPTION: boolean
  }
  const config: Config

  export default config
}
