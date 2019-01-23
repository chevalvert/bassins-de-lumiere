import DomComponent from 'abstractions/DomComponent'
import html from 'nanohtml'
import InputRange from 'components/input-range'
import OnionSkin from 'components/onion-skin'
import PanoramasLauncher from 'components/panoramas-launcher'
import SidebarPanoramaDetails from 'components/sidebar-panorama-details'

export default class Sidebar extends DomComponent {
  render () {
    this.refs.sliders = [
      this.registerComponent(InputRange, {
        label: 'ouverture',
        storeKey: 'aperture',
        value: window.configuration['defaultAperture'],
        range: [0, 1],
        step: 1 / 360,
        fill: true
      }),
      this.registerComponent(InputRange, {
        label: 'direction',
        storeKey: 'heading',
        value: window.configuration['defaultHeading'],
        range: [0, 1],
        step: 1 / 360
      })
    ]

    this.refs.onionSkin = this.registerComponent(OnionSkin)
    this.refs.panoramasLauncher = this.registerComponent(PanoramasLauncher)
    this.refs.panoramaDetails = this.registerComponent(SidebarPanoramaDetails)

    return html`
    <section class='sidebar'>
      ${this.refs.panoramaDetails.raw()}
      <div class='sidebar__sections'>
        <div class='sidebar__section'>
          ${this.refs.onionSkin.raw()}
        </div>
        <div class='sidebar__section'>
          ${this.refs.sliders.map(slider => slider.raw())}
        </div>
        <div class='sidebar__section' id='panoramasLauncher'>
          ${this.refs.panoramasLauncher.raw()}
        </div>
      </div>
    </section>`
  }
}
