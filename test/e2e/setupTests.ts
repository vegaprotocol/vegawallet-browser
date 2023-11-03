import 'jest-expect-message'
import path from 'path'
import dotenv from 'dotenv'

const envPath = path.join(__dirname, '../test-config', '.env.test')
if (process.env.GITHUB_ACTIONS !== 'true') {
  dotenv.config({ path: envPath })
}
