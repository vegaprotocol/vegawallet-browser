const mockPort = 9090

const test = {
  test: {
     mockPort,
  },
  network: {
    name: 'Test',
    rest: [`http://localhost:${mockPort}`],
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

export default test
