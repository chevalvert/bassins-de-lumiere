import DomComponent from 'abstractions/DomComponent'
import html from 'nanohtml'
import InputPathHandle from 'components/input-path-handle'
import MapBoxOverlay from 'components/map-box-overlay'
import store from 'controllers/store'

export default class MapBox extends DomComponent {
  render () {
    const map = store.get('map')
    this.refs.overlay = this.registerComponent(MapBoxOverlay)
    this.refs.handles = [
      this.registerComponent(InputPathHandle, {
        value: 0,
        storeKey: 'currentPointA'
      }),
      this.registerComponent(InputPathHandle, {
        value: 1,
        storeKey: 'currentPointB'
      })
    ]

    return html`
    <section class='map-box'>
      ${map.element}
      <div class='map-box__overlay'>
        ${this.refs.overlay.raw()}
      </div>
      <div class='map-box__handles'>
        ${this.refs.handles.map(e => e.raw())}
      </div>
    </section>`
  }
}
