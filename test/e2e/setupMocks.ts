import test from '../../config/beta'
import { closeServerAndWait, server } from './helpers/wallet/http-server'

beforeAll(() => {
  server.listen(test.test.mockPort)
})

afterAll(async () => {
  await closeServerAndWait()
})
