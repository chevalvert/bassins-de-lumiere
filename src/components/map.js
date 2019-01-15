import DomComponent from 'abstractions/DomComponent'
import html from 'nanohtml'
import store from 'controllers/store'

export default class Map extends DomComponent {
  constructor () {
    super()
  }

  render () {
    return html`
    <section class='map'>
      hello
    </section>`
  }
}
