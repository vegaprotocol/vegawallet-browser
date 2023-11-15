import fs from 'node:fs'

function camelCaseToWords(s) {
  const result = s.replace(/([A-Z])/g, ' $1')
  return result.charAt(0).toUpperCase() + result.slice(1)
}

const camelToSnakeCase = (str) => str.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`)

const SEND_TRANSACTION_JSON_PATH = './web-extension/schemas/client/send-transaction.json'

const json = fs.readFileSync(SEND_TRANSACTION_JSON_PATH, { encoding: 'utf-8' })
const transactionsJson = JSON.parse(json)
const transaction = transactionsJson
const transactionTypes = transaction.properties.transaction.oneOf

const keys = transactionTypes.map((t) => t.required[0])

const enumString = `
export enum TransactionKeys {
  UNKNOWN = 'unknown',
${keys.map((k) => `  ${camelToSnakeCase(k).toUpperCase()} = '${k}',\n`).join('')}
}
`

const titleMap = `
export const TRANSACTION_TITLES: Record<TransactionKeys, string> = {
    [TransactionKeys.UNKNOWN]: 'unknown',
    ${keys.map((k) => `  [TransactionKeys.${camelToSnakeCase(k).toUpperCase()}]: '${camelCaseToWords(k)}',\n`).join('')}
}
`

console.log(enumString)
console.log(titleMap)
