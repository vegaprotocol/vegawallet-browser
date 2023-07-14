export const getExtensionApi = (): typeof chrome => {
  // @ts-ignore
  return globalThis.browser ?? globalThis.chrome
}
