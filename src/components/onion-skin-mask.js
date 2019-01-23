import Canvas from 'abstractions/Canvas'
import html from 'nanohtml'
import store from 'controllers/store'

export default class OnionSkinMask extends Canvas {
  render () {
    return html`<canvas class='onion-skin-mask'/>`
  }

  didMount () {
    super.didMount()
    this.bindFuncs(['update'])
    store.watch('aperture', this.update)
    store.watch('heading', this.update)
    this.update()
  }

  willUnmount () {
    super.willUnmount()
    store.unwatch('aperture', this.update)
    store.unwatch('heading', this.update)
  }

  didResize () {
    super.didResize()
    this.update()
  }

  update () {
    const aperture = Math.ceil(store.get('aperture') * 100) / 100
    const heading = store.get('heading')
    const radius = this.width / 2
    const center = [this.width / 2, this.height / 2]
    const thetas = [
      (heading - (1 - aperture) / 2) * (Math.PI * 2),
      (heading + (1 - aperture) / 2) * (Math.PI * 2)
    ]
    const opacity = window.configuration['onionSkinsMaskOpacity']

    window.requestAnimationFrame(() => {
      this.clear()
      this.context.fillStyle = `rgba(0, 0, 0, ${opacity})`

      this.context.beginPath()
      this.context.moveTo(...center)
      this.context.arc(...center, radius, ...thetas, false)
      this.context.fill()
    })
  }
}
