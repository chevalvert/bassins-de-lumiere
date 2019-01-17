import DomComponent from 'abstractions/DomComponent'
import html from 'nanohtml'
import InputRange from 'components/input-range'
import InputToggle from 'components/input-toggle'
import OnionSkin from 'components/onion-skin'
import raw from 'nanohtml/raw'

export default class Sidebar extends DomComponent {
  render () {
    const sliders = [
      this.registerComponent(InputRange, {
        label: 'test slider "from"',
        storeKey: 'currentPointA',
        value: 0,
        range: [0, 79],
        step: 1
      }),
      this.registerComponent(InputRange, {
        label: 'test slider "to"',
        storeKey: 'currentPointB',
        value: 79,
        range: [0, 79],
        step: 1
      }),
      this.registerComponent(InputRange, {
        label: 'test slider "one point"',
        storeKey: 'currentPointC',
        value: 79,
        range: [0, 79],
        step: 1
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
        ${sliders.map(slider => slider.raw())}
      </div>
      <div class='sidebar__section'>
        ${this.refs.onionSkin.raw()}
      </div>
    </section>`
  }
}
