import Canvas from 'abstractions/Canvas'
import html from 'nanohtml'
import store from 'controllers/store'

export default class OnionSkinMask extends Canvas {
  render () {
    return html`<canvas class='onion-skin-mask'/>`
  }

  didMount () {
    super.didMount()
    this.bindFuncs(['updateSize', 'update'])

    window.addEventListener('resize', this.updateSize)
    this.updateSize()

    store.watch('aperture', this.update)
    store.watch('heading', this.update)
    this.update()
  }

  willUnmount () {
    super.willUnmount()
    window.removeEventListener('resize', this.updateSize)
    store.unwatch('aperture', this.update)
    store.unwatch('heading', this.update)
  }

  updateSize () {
    const container = this.refs.base.parentNode
    const width = container.clientWidth
    const height = container.clientHeight
    this.resize([width, height])
  }

  update () {
    const aperture = store.get('aperture')
    const heading = store.get('heading')
    const radius = this.width / 2
    const center = [this.width / 2, this.height / 2]
    const thetas = [
      (heading - (1 - aperture) / 2) * 2 * Math.PI,
      (heading + (1 - aperture) / 2) * 2 * Math.PI
    ]

    window.requestAnimationFrame(() => {
      this.clear()
      this.context.fillStyle = 'rgba(0, 0, 0, 0.8)'

      this.context.beginPath()
      this.context.moveTo(...center)
      this.context.arc(...center, radius, ...thetas, false)
      this.context.fill()
    })
  }
}
