import 'jest-webextension-mock'

const windows = {
  create: jest.fn(),
  get: jest.fn(),
  getAll: jest.fn(),
  getCurrent: jest.fn(),
  getLastFocused: jest.fn(),
  remove: jest.fn(),
  update: jest.fn(),
  onBoundsChanged: {
    addListener: jest.fn(),
    removeListener: jest.fn()
  },
  onCreated: {
    addListener: jest.fn(),
    removeListener: jest.fn()
  },
  onFocusChanged: {
    addListener: jest.fn(),
    removeListener: jest.fn()
  },
  onRemoved: {
    addListener: jest.fn(),
    removeListener: jest.fn()
  }
}

global.chrome = {
  ...global.chrome,
  windows
}
global.browser = {
  ...global.browser,
  windows
}
