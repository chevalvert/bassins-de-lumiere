import App from 'layouts/app'
import iddle from 'controllers/iddle'
import load from 'controllers/loader'

if (!window.isProduction) {
  require('fps-indicator')({ position: 'bottom-left' })
}

const app = new App()

load().then(() => {
  document.title = `${document.title} – ${window.configuration.package.version}`

  app.mount(document.body)
  console.log('[DEBUG] App is ready')

  iddle.reset()
})
