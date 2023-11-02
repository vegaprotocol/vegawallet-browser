// This script adds all AC files to the config so they are picked up by approbation

import fs from 'node:fs/promises'
import path from 'node:path'

const AC_PATH = path.resolve('.', './specs')
const APPS_PATH = path.resolve('.', './specs/apps.json')
const CATEGORIES_PATH = path.resolve('.', './specs/categories.json')

const folderContents = await fs.readdir(AC_PATH)
const files = folderContents.filter(async (file) => await (await fs.lstat(path.resolve(AC_PATH, file))).isFile())
const acFiles = files.filter((file) => file.endsWith('.md') && file.startsWith('11'))
const codes = acFiles.map((file) => {
  const [number, code] = file.split('-')
  return `${number}-${code}`
})

const apps = {
  'Browser-Wallet': {
    specs: codes
  }
}

const categories = {
  'Browser Wallet': {
    specs: codes
  }
}

await fs.writeFile(APPS_PATH, JSON.stringify(apps, null, 2))
await fs.writeFile(CATEGORIES_PATH, JSON.stringify(categories, null, 2))
