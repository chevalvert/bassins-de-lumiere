import 'controllers/single-point-mode'
import App from 'layouts/app'
import iddle from 'controllers/iddle'
import load from 'controllers/loader'

if (!window.isProduction) {
  require('fps-indicator')({ position: 'top-right', color: 'white' })
}

const app = new App()

load().then(() => {
  document.title = `${document.title} – ${window.configuration.package.version}`
  app.mount(document.body)
  iddle.reset()
})
