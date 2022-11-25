import fs from 'node:fs'
import path from 'node:path'

export default class FSMap extends Map {
  constructor(prefix) {
    const p = path.join(process.cwd(), '.vegawallet-js', prefix + '.json')
    fs.mkdirSync(path.dirname(p), { recursive: true })
    super(load(p))

    this._path = p
  }

  set(key, value) {
    super.set(key, value)
    save(this._path, Array.from(this.entries()))
  }

  clear() {
    super.clear()
    save(this._path, [])
  }
}

function load(p) {
  try {
    return JSON.parse(fs.readFileSync(p, 'utf8'))
  }
  catch (ex) {
    if (ex.code === 'ENOENT') return undefined
    throw ex
  }
}

function save(p, e) {
  fs.writeFileSync(p, JSON.stringify(e))
}
