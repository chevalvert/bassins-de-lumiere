import DomComponent from 'abstractions/DomComponent'
import html from 'nanohtml'
import InputRange from 'components/input-range'
import InputToggle from 'components/input-toggle'
import raw from 'nanohtml/raw'

export default class Sidebar extends DomComponent {
  render () {
    this.refs.test = this.registerComponent(InputToggle, {
      label: 'test toggle',
      tooltip: v => `test toggle ${(v * 100).toFixed(0)}%`,
      storeKey: 'debugToggle'
    })

    this.refs.test2 = this.registerComponent(InputRange, {
      label: 'test slider',
      tooltip: v => `test slider ${(v * 100).toFixed(0)}%`,
      storeKey: 'debugSlider'
    })

    this.refs.test3 = this.registerComponent(InputRange, {
      label: 'test slider range',
      tooltip: v => `test slider ${(v * 100).toFixed(0)}%`,
      step: 0.001,
      storeKey: 'debugSlider2',
      fill: true
    })

    return html`
    <section class='sidebar'>
      <h1 class='sidebar__title'>
        ${raw(window.configuration.html.title)}
      </h1>
      <div class='sidebar__section'>
        ${this.refs.test.raw()}
        ${this.refs.test2.raw()}
        ${this.refs.test3.raw()}
      </div>
    </section>`
  }
}
