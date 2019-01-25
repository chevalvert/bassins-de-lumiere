import Canvas from 'abstractions/Canvas'
import html from 'nanohtml'
import iddlers from 'controllers/iddlers'
import store from 'controllers/store'

export default class MapBoxOverlay extends Canvas {
  render () {
    return html`<canvas class='map-box-overlay--iddlers'/>`
  }

  didMount () {
    super.didMount()
    this.bindFuncs(['update', 'show', 'hide'])
    iddlers.on('start', this.show)
    iddlers.on('stop', this.hide)
    iddlers.on('update', this.update)

    this.getStyle()
  }

  willUnmount () {
    super.willUnmount()
    iddlers.off('start', this.show)
    iddlers.off('stop', this.hide)
    iddlers.off('update', this.update)
  }

  didResize () {
    super.didResize()
    this.update()
  }

  getStyle () {
    const style = window.getComputedStyle(this.refs.base)
    this.style = {
      color: style.getPropertyValue('--iddlers-color'),
      radius: parseInt(style.getPropertyValue('--iddlers-radius')),
      maxDeviation: parseInt(style.getPropertyValue('--iddlers-max-deviation'))
    }
  }

  update () {
    const path = store.get('path')
    const iddlers = store.get('iddlers')
    if (!window.isProduction) this.getStyle()

    this.clear()
    this.context.fillStyle = this.style.color

    iddlers.forEach(iddler => {
      const [nx, ny] = path.lerp(iddler.position)
      const [x, y] = [
        nx * this.width + iddler.offset[0] * this.style.maxDeviation,
        ny * this.height + iddler.offset[1] * this.style.maxDeviation
      ]
      this.context.beginPath()
      this.context.arc(x, y, this.style.radius, 0, 2 * Math.PI, false)
      this.context.fill()
    })
  }
}
