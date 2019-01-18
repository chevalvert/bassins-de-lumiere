import Canvas from 'abstractions/Canvas'
import html from 'nanohtml'
import store from 'controllers/store'

export default class MapBoxOverlay extends Canvas {
  render () {
    return html`<canvas class='map-box-overlay'/>`
  }

  didMount () {
    super.didMount()
    this.bindFuncs(['update'])
    store.watch('currentPointA', this.update)
    store.watch('currentPointB', this.update)
    store.watch('path', this.update)
    this.update()
  }

  willUnmount () {
    super.willUnmount()
    store.unwatch('currentPointA', this.update)
    store.unwatch('currentPointB', this.update)
    store.unwatch('path', this.update)
  }

  didResize () {
    super.didResize()
    this.update()
  }

  update () {
    const path = store.get('path')
    window.requestAnimationFrame(() => {
      this.clear()
      this.context.lineCap = 'round'
      this.context.lineJoin = 'round'
      this.renderPath(path.all, window.configuration['mapPathDefaultStyle'])
      this.renderPath(path.current, window.configuration['mapPathSelectedStyle'])
    })
  }

  renderPath (points, properties) {
    this.context.save()
    Object.entries(properties).forEach(([prop, value]) => {
      this.context[prop] = value
    })

    this.context.beginPath()
    points.forEach(([nx, ny], index) => {
      this.context[index === 0 ? 'moveTo' : 'lineTo'](nx * this.width, ny * this.height)
    })
    this.context.stroke()
    this.context.restore()
  }
}
