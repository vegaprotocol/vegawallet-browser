const mockPort = 9090

const test = {
  // See below comment why i have put this here
  test: {
     // Renamed to remove node as node doesn't really add any extra description
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

test.rest = [`http://localhost:${test.mockNodePort}`]

export default test
