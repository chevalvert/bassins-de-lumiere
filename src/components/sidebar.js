import DomComponent from 'abstractions/DomComponent'
import html from 'nanohtml'
import InputRange from 'components/input-range'
import InputToggle from 'components/input-toggle'
import OnionSkin from 'components/onion-skin'
import raw from 'nanohtml/raw'
import store from 'controllers/store'

export default class Sidebar extends DomComponent {
  didMount () {
    this.bindFuncs(['toggleSinglePointMode'])
    store.watch('singlePointMode', this.toggleSinglePointMode)
  }

  toggleSinglePointMode (value = false) {
    this.refs.inputs[1].refs.base.style.display = !value ? '' : 'none'
    this.refs.inputs[2].refs.base.style.display = !value ? '' : 'none'
    this.refs.inputs[3].refs.base.style.display = value ? '' : 'none'
  }

  render () {
    // TODO: better storage of inputs for later use
    this.refs.inputs = [
      this.registerComponent(InputToggle, {
        label: 'single point mode',
        value: false,
        storeKey: 'singlePointMode'
      }),
      this.registerComponent(InputRange, {
        label: 'test slider "from"',
        storeKey: 'currentPointA',
        value: 0,
        range: [0, 1],
        step: 0.01
      }),
      this.registerComponent(InputRange, {
        label: 'test slider "to"',
        storeKey: 'currentPointB',
        value: 1,
        range: [0, 1],
        step: 0.01
      }),
      this.registerComponent(InputRange, {
        label: 'test slider "one point"',
        storeKey: 'currentPointC',
        value: 1,
        range: [0, 1],
        step: 0.01
      }),
      this.registerComponent(InputRange, {
        label: 'test slider "aperture"',
        storeKey: 'aperture',
        value: 0.5,
        range: [0, 1],
        step: 1 / 360,
        fill: true
      }),
      this.registerComponent(InputRange, {
        label: 'test slider "heading"',
        storeKey: 'heading',
        value: 1,
        range: [0, 1],
        step: 1 / 360
      })
    ]

    this.refs.onionSkin = this.registerComponent(OnionSkin)

    return html`
    <section class='sidebar'>
      <h1 class='sidebar__title'>
        ${raw(window.configuration.html.title)}
      </h1>
      <div class='sidebar__section'>
        ${this.refs.inputs.map(slider => slider.raw())}
      </div>
      <div class='sidebar__section'>
        ${this.refs.onionSkin.raw()}
      </div>
    </section>`
  }
}
