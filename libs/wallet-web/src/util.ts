type Platform = 'chrome' | 'firefox'

export const getPlatform = (): Platform => {
  if (typeof browser !== 'undefined') {
    return 'firefox'
  }

  if (typeof chrome !== 'undefined') {
    return 'chrome'
  }

  throw new Error(
    'Unsupported platform, both "chrome" or "browser" is unavailable in the global namespace.'
  )
}

export const getRuntime = () => {
  if (typeof browser !== 'undefined') {
    return browser.runtime
  }

  if (typeof chrome !== 'undefined') {
    return chrome.runtime
  }

  throw new Error(
    'Unsupported platform, both "chrome" or "browser" is unavailable in the global namespace.'
  )
}

export const getStorage = () => {
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
