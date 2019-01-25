import DomComponent from 'abstractions/DomComponent'
import html from 'nanohtml'
import raw from 'nanohtml/raw'
import store from 'controllers/store'

export default class SidebarPanoramaDetails extends DomComponent {
  didMount () {
    this.bindFuncs(['load'])
    store.watch('panorama', this.load, { immediate: true })
  }

  willUnmount () {
    store.unwatch('panorama', this.load)
  }

  render () {
    this.refs.properties = {
      gid: html`<li data-label='gid'></li>`,
      svf: html`<li data-label='svf'></li>`,
      area: html`<li data-label='aire' data-unit='m²'></li>`,
      perimeter: html`<li data-label='périmètre' data-unit='m²'></li>`,
      sun_hits: html`<li data-label='sun_hits'></li>`,
      sun_ratio: html`<li data-label='sun_ratio'></li>`,
      sun_hours: html`<li data-label='sun_hours' data-unit='heures'></li>`
    }

    return html`
    <section class='sidebar-panorama-details'>
      <a href='#' class='sidebar-panorama-details__close' onclick='${e => e.preventDefault() || store.set('panorama', undefined)}'>
        ${raw('&times;')}
      </a>
      <ul class='sidebar-panorama-details__properties'>
        ${Object.values(this.refs.properties)}
      </ul>
    </section>`
  }

  load (point) {
    if (!this.mounted) return

    if (!point) {
      this.hide()
      return
    }

    if (!window.isProduction) console.log(point)

    Object.entries(point.features.properties).forEach(([key, value]) => {
      if (!this.refs.properties.hasOwnProperty(key)) return
      this.refs.properties[key].innerHTML = value
    })

    this.show()
  }
}
