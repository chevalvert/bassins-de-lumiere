import DomComponent from 'abstractions/DomComponent'
import html from 'nanohtml'
import raw from 'nanohtml/raw'
import store from 'controllers/store'

const parsers = {
  gid: v => v,
  svf: v => (v * 100).toFixed(1),
  area: v => Math.round(v).toFixed(0),
  perimeter: v => Math.round(v).toFixed(0),
  sun_ratio: v => (v * 100).toFixed(1),
  sun_hours: v => v
}

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
      gid: html`<li data-label='position'></li>`,
      svf: html`<li data-label='svf' data-unit='%'></li>`,
      area: html`<li data-label='aire' data-unit='m²'></li>`,
      perimeter: html`<li data-label='périmètre' data-unit='m'></li>`,
      sun_ratio: html`<li data-label="ratio théorique d'ensoleillement" data-unit='%'></li>`,
      sun_hours: html`<li data-label='ensoleillement annuel moyen' data-unit='heures'></li>`
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
      this.refs.properties[key].innerHTML = parsers[key]
        ? parsers[key](value)
        : value
    })

    this.show()
  }
}
