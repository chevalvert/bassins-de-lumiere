import DomComponent from 'abstractions/DomComponent'
import html from 'nanohtml'
import MapBox from 'components/map-box'
import Sidebar from 'components/sidebar'

export default class App extends DomComponent {
  render () {
    this.refs.map = this.registerComponent(MapBox)
    this.refs.sidebar = this.registerComponent(Sidebar)

    return html`
    <main id='App' class='app'>
      ${this.refs.map.raw()}
      ${this.refs.sidebar.raw()}
    </main>`
  }
}
