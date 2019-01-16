import 'nodelist-foreach'
import DomComponent from 'abstractions/DomComponent'
import html from 'nanohtml'
import store from 'controllers/store'
import { normalize } from 'missing-math'

export default class OnionSkin extends DomComponent {
  constructor () {
    super()
    this.visibleSkinsIndexesRange = []
  }

  didMount () {
    store.watch('currentPointA', index => {
      this.visibleSkinsIndexesRange[0] = index
      this.update()
    }, true)

    store.watch('currentPointB', index => {
      this.visibleSkinsIndexesRange[1] = index
      this.update()
    }, true)

    store.watch('currentPointC', index => {
      store.set('currentPointA', index)
      store.set('currentPointB', index)
    })
  }

  render () {
    this.refs.skins = store.get('points').map(point =>
      html`
        <li class='onion-skin__skin' id='skin_${point.index}'>
          <svg viewBox='${point.createViewBox({ padding: 1 })}'>
            ${point.shapeEl}
          </svg>
        </li>`
    )

    return html`
    <div class='onion-skin'>
      <ul class='onion-skin__skins'>
        ${this.refs.skins}
      </ul>
    </div>
    `
  }

  update () {
    window.requestAnimationFrame(() => {
      this.hideAllSkins()

      const range = [...this.visibleSkinsIndexesRange].sort((a, b) => a - b)
      for (let i = range[0]; i <= range[1]; i++) {
        const opacity = range[0] < range[1]
          ? normalize(i, range[0], range[1]) ** window.configuration['onionSkinsOpacityCutoffFactor']
          : 1
        this.showSkin(i, { opacity })
      }
    })
  }

  hideAllSkins () {
    this.refs.skins.forEach(skin => {
      skin.style.display = 'none'
    })
  }

  showSkin (index, { opacity = 1 } = {}) {
    const skinEl = this.refs.skins[index]
    if (!skinEl) return
    skinEl.style.display = ''
    skinEl.style.opacity = opacity.toFixed(2)
  }
}