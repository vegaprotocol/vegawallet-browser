const windows = globalThis.browser?.windows ?? globalThis.chrome?.windows
const runtime = globalThis.browser?.runtime ?? globalThis.chrome?.runtime

export const createWindow = (top = undefined, left = undefined, once = false) => {
  const url = once ? '/index.html?once=1' : '/index.html'
  return windows.create({
    url: runtime.getURL(url),
    type: 'popup',
    focused: true,
    // Approximate dimension. The client figures out exactly how big it should be as this height/width
    // includes the frame and different OSes have different sizes
    width: 360,
    height: 600,
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
    left = lastFocused.left + (lastFocused.width - 360)
  } catch (_) {}

  return createWindow(top, left, true)
}
