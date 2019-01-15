import DomComponent from 'abstractions/DomComponent'
import html from 'nanohtml'
import Map from 'components/map'
import Sidebar from 'components/sidebar'

export default class App extends DomComponent {
  render () {
    this.refs.sidebar = this.registerComponent(Sidebar)
    this.refs.map = this.registerComponent(Map)

    return html`
    <main id='App' class='app'>
      ${this.refs.map.raw()}
      ${this.refs.sidebar.raw()}
    </main>`
  }
}
