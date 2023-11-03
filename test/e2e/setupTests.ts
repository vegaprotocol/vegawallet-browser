import 'jest-expect-message'
import path from 'path'
import dotenv from 'dotenv'

const envPath = path.join(__dirname, '../test-config', '.env.test')
if (process.env.GITHUB_ACTIONS !== 'true') {
  console.log('not in a github env')
  dotenv.config({ path: envPath })
} else {
  console.log('in a github env')
}
