import DomComponent from 'abstractions/DomComponent'
import html from 'nanohtml'

export default class Canvas extends DomComponent {
  render () {
    return html`<canvas></canvas>`
  }

  didMount () {
    this.bindFuncs(['didResize', 'updateSize'])
    this.context = this.refs.base.getContext('2d')

    window.addEventListener('resize', this.updateSize)
    this.updateSize()
  }

  willUnmount () {
    window.removeEventListener('resize', this.updateSize)
  }

  willResize () {}
  didResize () {}

  updateSize () {
    const container = this.refs.base.parentNode
    const width = container.clientWidth
    const height = container.clientHeight
    this.resize([width, height])
  }

  resize ([width, height], css = true) {
    window.requestAnimationFrame(() => {
      this.willResize()
      this.width = width
      this.height = height
      this.refs.base.width = this.width
      this.refs.base.height = this.height
      if (css) {
        this.refs.base.style.width = this.width + 'px'
        this.refs.base.style.height = this.height + 'px'
      }
      this.didResize()
    })
  }

  smooth (v = true) {
    this.context.imageSmoothingEnabled = v
  }

  toDataURL () {
    return this.refs.base.toDataURL()
  }

  clear () {
    this.context.clearRect(0, 0, this.width, this.height)
  }
}
