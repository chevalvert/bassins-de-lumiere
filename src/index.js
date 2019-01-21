import App from 'layouts/app'
import load from 'controllers/loader'
import * as Kaleidoscope from 'kaleidoscopejs'

if (!window.isProduction) {
  require('fps-indicator')({ position: 'bottom-left' })
}

const viewer = new Kaleidoscope.Image({
  // SEE: https://github.com/thiagopnts/kaleidoscope#kaleidoscopeimage
  source: 'datas/vert1/spheres/63.png',
  container: document.body
})
viewer.render()

const app = new App()

load(() => {
  document.title = `${document.title} – ${window.configuration.package.version}`

  app.mount(document.body)
  console.log('[DEBUG] App is ready')
})
