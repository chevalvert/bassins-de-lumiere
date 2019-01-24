import * as Kaleidoscope from 'kaleidoscopejs'
import DomComponent from 'abstractions/DomComponent'
import html from 'nanohtml'
import store from 'controllers/store'
import { radians } from 'missing-math'
import { raf } from '@internet/raf'

export default class Panorama extends DomComponent {
  didMount () {
    this.bindFuncs(['load', 'spy'])
    store.watch('panorama', this.load)
  }

  willUnmount () {
    store.unwatch('panorama', this.load)
  }

  render () {
    return html`<section class='panorama' style='display:none'/>`
  }

  load (point) {
    if (!point) {
      this.hide()
      return
    }

    this.saveStore()

    this.show()
    this.viewer = new Kaleidoscope.Image({
      // SEE: https://github.com/thiagopnts/kaleidoscope#kaleidoscopeimage
      source: point.panorama.src,
      container: this.refs.base,
      width: this.width,
      height: this.height,
      initialYaw: store.get('heading') * 360
    })

    store.set('singlePointMode', true)
    store.set('aperture', 120 / 360)
    this.viewer.controls.phi = radians(window.configuration['panoramaInitialPitch'])

    raf.add(this.spy)

    this.viewer.render()
  }

  spy () {
    // TODO: find correct panoramaHeadingOffset
    const thetaOff = radians(window.configuration['panoramaHeadingOffset'])
    const theta = (thetaOff + this.viewer.controls.theta) % (Math.PI * 2)
    store.set('heading', theta / (Math.PI * 2))
  }

  hide () {
    super.hide()
    raf.remove(this.spy)
    this.restoreStore()
    if (this.viewer) this.viewer.destroy()
  }

  saveStore () {
    this.previousState = {}
    ;[
      'singlePointMode',
      'aperture',
      'heading',
      'maxProgressPercent',
      'minProgressPercent'
    ].forEach(key => {
      this.previousState[key] = store.get(key)
    })
  }

  restoreStore () {
    if (!this.previousState) return
    Object.entries(this.previousState).forEach(([key, value]) => {
      store.set(key, value)
    })
  }

  get width () { return this.mounted ? this.refs.base.clientWidth : null }
  get height () { return this.mounted ? this.refs.base.clientHeight : null }
}
