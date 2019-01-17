import 'nodelist-foreach'
import DomComponent from 'abstractions/DomComponent'
import html from 'nanohtml'
import OnionSkinMask from 'components/onion-skin-mask'
import store from 'controllers/store'
import { normalize } from 'missing-math'

export default class OnionSkin extends DomComponent {
  constructor () {
    super()
    this.visibleSkinsIndexesRange = []
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

    this.refs.mask = this.registerComponent(OnionSkinMask)

    return html`
    <div class='onion-skin'>
      <ul class='onion-skin__skins'>
        ${this.refs.skins}
      </ul>
      <div class='onion-skin__mask'>
        ${this.refs.mask.raw()}
      </div>
    </div>`
  }

  didMount () {
    store.watch('currentPointA', index => {
      this.visibleSkinsIndexesRange[0] = index
      this.update()
    }, { immediate: true })

    store.watch('currentPointB', index => {
      this.visibleSkinsIndexesRange[1] = index
      this.update()
    }, { immediate: true })

    store.watch('currentPointC', index => {
      store.set('currentPointA', index)
      store.set('currentPointB', index)
    })
  }

  update () {
    window.requestAnimationFrame(() => {
      this.hideAllSkins()

      const cutoff = window.configuration['onionSkinsOpacityCutoffFactor']
      const range = [...this.visibleSkinsIndexesRange].sort((a, b) => a - b)
      for (let i = range[0]; i <= range[1]; i++) {
        const opacity = range[0] < range[1]
          ? normalize(i, range[0], range[1]) ** cutoff
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
