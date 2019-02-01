import 'controllers/hardware'
import 'controllers/single-point-mode'
import App from 'layouts/app'
import iddle from 'controllers/iddle'
import load from 'controllers/loader'
import store from 'controllers/store'

if (!window.isProduction) {
  require('fps-indicator')({ position: 'top-right', color: 'white' })

  // NOTE: this function shouldn't be used outside devtools console
  window.debugLight = index => {
    store.set('singlePointMode', true)
    store.set('maxProgressPercent', index / store.get('points').length)
    return index
  }
}

const app = new App()

load().then(() => {
  document.title = `${document.title} – ${window.configuration.package.version}`
  app.mount(document.body)
  iddle.reset()
})
