import cuid from 'cuid'
import DomComponent from 'abstractions/DomComponent'
import store from 'controllers/store'

export default class Input extends DomComponent {
  constructor ({
    value,
    storeKey
  } = {}) {
    super()
    this.defaultValue = value
    this.storeKey = storeKey || this.constructor.name + '_' + cuid()
    this.bindFuncs(['onchange', 'reset'])
  }

  didMount () {
    this.onchange()
    store.watch(this.storeKey, value => this.silentExec(() => {
      this.value = value
    }))
  }

  onchange (e, t) {
    if (this.noStore) return
    store.set(this.storeKey, this.value)
  }

  silentExec (callback) {
    this.noStore = true
    callback()
    this.noStore = false
  }

  reset () {
    if (!this.mounted) return
    this.value = this.defaultValue
  }

  set value (value) {
    if (!this.mounted) return
    this.refs.base.value = value
    this.onchange()
  }

  get value () {
    return this.mounted && this.refs.base.value
  }
}
