export default class LSMap extends Map {
  constructor(prefix) {
    super(load(prefix))
    this._prefix = prefix
  }

  set(key, value) {
    super.set(key, value)
    save(this._prefix)
  }

  clear() {
    super.clear()
    remove(this._prefix)
  }
}

function load(p) {
  JSON.parse(global.localStorage.getItem(p))
}

function save(p, e) {
  global.localStorage.setItem(p, JSON.stringify(e))
}

function remove(p) {
  global.localStorage.removeItem(p)
}
