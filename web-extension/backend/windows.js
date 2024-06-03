import { CONSTANTS } from '../../lib/constants'

const windows = globalThis.browser?.windows ?? globalThis.chrome?.windows
const runtime = globalThis.browser?.runtime ?? globalThis.chrome?.runtime

const BUFFER_HEIGHT = 30

export const createWindow = async (top = undefined, left = undefined, once = false) => {
  const url = once ? 'index.html?once=1' : 'index.html'
  return windows.create({
    url: runtime.getURL(url),
    type: 'popup',
    focused: true,
    // Approximate dimension. The client figures out exactly how big it should be as this height/width
    // includes the frame and different OSes have different sizes
    width: CONSTANTS.width,
    height: CONSTANTS.defaultHeight + BUFFER_HEIGHT,
    top,
    left
  })
}

export const createNotificationWindow = async () => {
  let left = 0
  let top = 0
  try {
    const lastFocused = await windows.getLastFocused()
    top = lastFocused.top
    left = lastFocused.left + (lastFocused.width - CONSTANTS.width)
  } catch (_) {}

  return createWindow(top, left, true)
}

/**
 * Closes the window if there is a popup and that popup is the only one open.
 * NOTE: Could potentially cause issues if the popup is not created from our extension.
 * @returns {Promise<void>}
 */
export const maybeCloseWindow = async () => {
  const allWindows = await windows.getAll()
  const wins = allWindows.filter((win) => win.type === 'popup')
  if (wins.length === 1) {
    await windows.remove(wins[0].id)
  }
}
