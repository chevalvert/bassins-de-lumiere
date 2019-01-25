import debounce from 'utils/debounce'
import DomComponent from 'abstractions/DomComponent'
import html from 'nanohtml'
import store from 'controllers/store'

export default class PanoramasLauncher extends DomComponent {
  didMount () {
    this.bindFuncs(['update'])
    this.update = debounce(this.update.bind(this), window.configuration['panoramasLauncherUpdaterDebounceDelay'])

    store.watch('minProgressPercent', this.update)
    store.watch('maxProgressPercent', this.update)
    this.update()
  }

  willUnmount () {
    store.unwatch('minProgressPercent', this.update)
    store.unwatch('maxProgressPercent', this.update)
  }

  render () {
    this.refs.panoramas = store.get('points').filter(p => p.hasPanorama).map(p =>
      html`
      <li class='panoramas-launcher__panorama' id='panorama_${p.index}'>
        <a href='${p.panorama.src}' onclick='${e => e.preventDefault() || store.set('panorama', p)}'>
          ${p.panorama}
        </a>
      </li>`
    )

    return html`
    <div class='panoramas-launcher'>
      <ul class='panoramas-launcher__panoramas'>
        ${this.refs.panoramas}
      </ul>
    </div>`
  }

  update () {
    const path = store.get('path')

    window.requestAnimationFrame(() => {
      this.hideAllPanoramas()
      for (let i = path.currentPointsIndexesRange[0]; i <= path.currentPointsIndexesRange[1]; i++) {
        this.showPanorama(i)
      }

      this.refs.base.scrollLeft = path.currentPointsIndexesRange[0] !== path.currentPointsIndexesRange[1]
        ? 20
        : 0
    })
  }

  hideAllPanoramas () {
    this.refs.panoramas.forEach(el => {
      el.style.display = 'none'
    })
  }

  showPanorama (index) {
    const panorama = document.getElementById('panorama_' + index)
    if (!panorama) return
    panorama.style.display = 'inline-block'
  }
}
