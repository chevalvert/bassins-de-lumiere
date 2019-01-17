import DomComponent from 'abstractions/DomComponent'
import html from 'nanohtml'

export default class Canvas extends DomComponent {
  render () {
    return html`<canvas></canvas>`
  }

  didMount () {
    this.bindFuncs(['didResize'])
    this.context = this.refs.base.getContext('2d')
  }

  willResize () {}
  didResize () {}

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
