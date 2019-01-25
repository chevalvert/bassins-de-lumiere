import Emitter from 'tiny-emitter'

const events = new Emitter()
const NS = '__STORE.'
const stored = {}

if (!window.isProduction) {
  window.store = stored
}

export default {
  watch: (k, cb, { immediate = false } = {}) => {
    events.on(NS + k, cb)
    immediate && cb(stored[k])
  },
  watchOnce: (k, cb, { immediate = false } = {}) => {
    events.once(NS + k, cb)
    immediate && cb(stored[k])
  },
  unwatch: (k, cb) => events.off(NS + k, cb),

  get: k => stored[k],
  set: (k, val) => {
    if (!k) return
    stored[k] = val
    events.emit(NS + k, val)
    return val
  }
}
