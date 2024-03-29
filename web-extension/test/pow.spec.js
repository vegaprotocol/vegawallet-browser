import pow from '../backend/pow.js'
import inprocess from '../backend/pow/in-process.js'
import chromium from '../backend/pow/chromium.js'
import webworker from '../backend/pow/web-worker.js'

describe('pow', () => {
  it('should be able to solve a puzzle', async () => {
    const solution = await pow({
      difficulty: 1,
      blockHash: 'A00000000000000000000000000000000000000000000000000000000000000F',
      tid: 'A00000000000000000000000000000000000000000000000000000000000000F'
    })

    expect(solution).toHaveProperty('nonce')
    expect(solution).toHaveProperty('tid')
    expect(solution).toHaveProperty('hashFunction')
  })

  it('in-process solver should always be available', async () => {
    const solver = await inprocess()
    expect(solver).not.toBe(false)
    expect(typeof solver).toBe('function')
  })

  it('chromium solver should be false if not chromium', async () => {
    const solver = await chromium()
    expect(solver).toBe(false)
  })

  it('chromium solver should be function if chromium-like', async () => {
    expect(globalThis.chrome.offscreen).toBe(undefined)

    globalThis.chrome.offscreen = {
      createDocument: () => {}
    }

    const solver = await chromium()
    expect(solver).not.toBe(false)
    expect(typeof solver).toBe('function')

    delete globalThis.chrome.offscreen
  })

  it('webworker solver should be false if workers are unavailable', async () => {
    const solver = await webworker()
    expect(solver).toBe(false)
  })

  it('webworker solver should be function if workers are available', async () => {
    expect(globalThis.Worker).toBe(undefined)
    expect(globalThis.navigator).toBe(undefined)

    globalThis.Worker = class {}
    globalThis.navigator = {
      hardwareConcurrency: 1
    }

    const solver = await webworker()
    expect(solver).not.toBe(false)
    expect(typeof solver).toBe('function')

    delete globalThis.Worker
    delete globalThis.navigator
  })
})
