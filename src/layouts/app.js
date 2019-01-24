import DomComponent from 'abstractions/DomComponent'
import html from 'nanohtml'
import MapBox from 'components/map-box'
import Panorama from 'components/panorama'
import raw from 'nanohtml/raw'
import Sidebar from 'components/sidebar'

export default class App extends DomComponent {
  render () {
    this.refs.map = this.registerComponent(MapBox)
    this.refs.panorama = this.registerComponent(Panorama)
    this.refs.sidebar = this.registerComponent(Sidebar)

    return html`
    <main id='App' class='app'>
      <section class='layout-left'>
        <h1>
          <span>${raw(window.configuration['html'].title.replace(/<br>/g, ''))}</span>
        </h1>
      </section>
      <section class='layout-center'>
        ${this.refs.map.raw()}
        ${this.refs.panorama.raw()}
      </section>
      <section class='layout-right'>
        ${this.refs.sidebar.raw()}
      </section>
    </main>`
  }
}
