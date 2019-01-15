import App from 'layouts/app'
import load from 'controllers/loader'
// import raw from 'nanohtml/raw'

const app = new App()

load(() => {
  document.title = `${document.title} – ${window.configuration.package.version}`

  app.mount(document.body)
  console.log('[DEBUG] App is ready')
})
