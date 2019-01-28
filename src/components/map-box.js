import DomComponent from 'abstractions/DomComponent'
import html from 'nanohtml'
import InputPathHandle from 'components/input-path-handle'
import InputToggle from 'components/input-toggle'
import MapBoxOverlay from 'components/map-box-overlay'
import MapBoxOverlayIddlers from 'components/map-box-overlay--iddlers'
import store from 'controllers/store'

export default class MapBox extends DomComponent {
  render () {
    const map = store.get('map')
    this.refs.overlay = this.registerComponent(MapBoxOverlay)
    this.refs.overlayIddlers = this.registerComponent(MapBoxOverlayIddlers)
    this.refs.handles = [
      this.registerComponent(InputPathHandle, {
        value: 0,
        storeKey: 'minProgressPercent'
      }),
      this.registerComponent(InputPathHandle, {
        value: 1,
        storeKey: 'maxProgressPercent'
      })
    ]

    this.refs.singlePointModeToggler = this.registerComponent(InputToggle, {
      value: false,
      storeKey: 'singlePointMode'
    })

    return html`
    <section class='map-box' style='background-image: url(${map.background.src})'>
      ${map.element}
      <div class='map-box__overlay'>
        ${this.refs.overlay.raw()}
      </div>
      <div class='map-box__overlay'>
        ${this.refs.overlayIddlers.raw()}
      </div>
      <div class='map-box__handles'>
        ${this.refs.handles.map(e => e.raw())}
      </div>
      <div class='map-box__single-point-mode-toggler'>
        ${this.refs.singlePointModeToggler.raw()}
      </div>
    </section>`
  }
}
