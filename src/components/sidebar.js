import DomComponent from 'abstractions/DomComponent'
import html from 'nanohtml'
import InputRange from 'components/input-range'
import InputToggle from 'components/input-toggle'
import OnionSkin from 'components/onion-skin'
import raw from 'nanohtml/raw'

export default class Sidebar extends DomComponent {
  render () {
    this.refs.sliderA = this.registerComponent(InputRange, {
      label: 'A',
      range: [0, 79],
      step: 1,
      value: 0,
      tooltip: v => `test ${(v * 100).toFixed(0)}%`,
      storeKey: 'currentPointA'
    })

    this.refs.sliderB = this.registerComponent(InputRange, {
      label: 'B',
      range: [0, 79],
      step: 1,
      value: 79,
      tooltip: v => `test ${(v * 100).toFixed(0)}%`,
      storeKey: 'currentPointB'
    })

    this.refs.sliderC = this.registerComponent(InputRange, {
      label: 'C',
      range: [0, 79],
      step: 1,
      value: 79,
      tooltip: v => `test ${(v * 100).toFixed(0)}%`,
      storeKey: 'currentPointC'
    })

    this.refs.onionSkin = this.registerComponent(OnionSkin)

    return html`
    <section class='sidebar'>
      <h1 class='sidebar__title'>
        ${raw(window.configuration.html.title)}
      </h1>
      <div class='sidebar__section'>
        ${this.refs.sliderA.raw()}
        ${this.refs.sliderB.raw()}
        ${this.refs.sliderC.raw()}
      </div>
      <div class='sidebar__section'>
        ${this.refs.onionSkin.raw()}
      </div>
    </section>`
  }
}
