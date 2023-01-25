export type Engine =
  | typeof globalThis.browser.storage.local
  | typeof globalThis.chrome.storage.local
