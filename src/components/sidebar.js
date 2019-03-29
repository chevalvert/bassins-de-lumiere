import DomComponent from 'abstractions/DomComponent'
import html from 'nanohtml'
import InputRange from 'components/input-range'
import OnionSkin from 'components/onion-skin'
import PanoramasLauncher from 'components/panoramas-launcher'
import SidebarPanoramaDetails from 'components/sidebar-panorama-details'
import store from 'controllers/store'

export default class Sidebar extends DomComponent {
  didMount () {
    this.bindFuncs(['disableHeadingSlider'])
    store.watch('aperture', this.disableHeadingSlider, { immediate: true })
  }

  willUnmount () {
    store.unwatch('aperture', this.disableHeadingSlider)
  }

  disableHeadingSlider () {
    if (store.get('aperture') > 0.97) this.refs.sliders.heading.disable()
    else this.refs.sliders.heading.enable()
  }

  render () {
    this.refs.sliders = {
      aperture: this.registerComponent(InputRange, {
        label: 'ouverture',
        storeKey: 'aperture',
        value: window.configuration['defaultAperture'],
        range: [0, 1],
        step: 1 / 360,
        fill: true
      }),
      heading: this.registerComponent(InputRange, {
        label: 'direction',
        storeKey: 'heading',
        value: window.configuration['defaultHeading'],
        range: [-1, 1],
        step: 1 / 360
      })
    }

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
          ${Object.values(this.refs.sliders).map(slider => slider.raw())}
        </div>
        <div class='sidebar__section' id='panoramasLauncher'>
          ${this.refs.panoramasLauncher.raw()}
        </div>
      </div>
    </section>`
  }
}
