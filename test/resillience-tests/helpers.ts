import test from '../../config/test'
import { ServerConfig, createServer } from '../e2e/helpers/wallet/http-server'

export async function startServer(config: ServerConfig = {}) {
  const sv = createServer(config)
  sv.listen(test.test.mockPort)
  return sv
}
