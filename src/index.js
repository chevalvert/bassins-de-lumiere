import App from 'layouts/app'
import load from 'controllers/loader'

if (!window.isProduction) {
  require('fps-indicator')({ position: 'bottom-left' })
}

const app = new App()

load(() => {
  document.title = `${document.title} – ${window.configuration.package.version}`

  app.mount(document.body)
  console.log('[DEBUG] App is ready')
})
