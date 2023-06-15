const test = {
  network: {
    name: 'Test',
    rest: ['https://api.n06.testnet.vega.xyz', 'https://api.n07.testnet.vega.xyz'],
    console: 'https://console.fairground.wtf',
    explorer: 'https://explorer.fairground.wtf',
    mockNodePort: 9090
  },
  feedbackLink: 'https://github.com/vegaprotocol/feedback/discussions',
  encryptionSettings: {
    memory: 10,
    iterations: 1
  }
}

test.rest = [`http://localhost:${test.mockNodePort}`]

export default test
