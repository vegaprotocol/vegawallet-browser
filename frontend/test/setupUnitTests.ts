beforeEach(() => {
  // @ts-ignore
  global.browser = {
    runtime: {
      connect: () => {
        throw new Error(
          'Tried to connect to sock in a unit test. Unit tests should be mocked out completely, and should never require a connection to the socket.'
        )
      }
    }
  }
})

afterEach(() => {
  // @ts-ignore
  delete global.browser
})
