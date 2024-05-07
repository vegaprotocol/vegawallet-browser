import test from '../../config/test'
import { closeServerAndWait, server } from './helpers/wallet/http-server'

beforeAll(() => {
  console.log('Setting up server...')
  server.listen(test.test.mockPort)
})

afterAll(async () => {
  console.log('Closing server...')
  await closeServerAndWait()
})
