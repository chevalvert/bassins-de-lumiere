import 'nodelist-foreach'
import DomComponent from 'abstractions/DomComponent'
import html from 'nanohtml'
import OnionSkinMask from 'components/onion-skin-mask'
import store from 'controllers/store'
import { normalize } from 'missing-math'

export default class OnionSkin extends DomComponent {
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
    this.bindFuncs(['update'])

    store.watch('minProgressPercent', this.update)
    store.watch('maxProgressPercent', this.update)
    this.update()
  }

  update () {
    window.requestAnimationFrame(() => {
      const path = store.get('path')
      this.hideAllSkins()

      const cutoff = window.configuration['onionSkinsOpacityCutoffFactor']
      const opacity = i => path.currentPointsIndexesRange[0] < path.currentPointsIndexesRange[1]
        ? normalize(i, ...path.currentPointsIndexesRange) ** cutoff
        : 1

      // DEBUG: performance
      for (let i = path.currentPointsIndexesRange[0]; i <= path.currentPointsIndexesRange[1]; i++) {
        this.showSkin(i, { opacity: opacity(i) })
      }
    })
  }

  hideAllSkins () {
    this.refs.skins.forEach(skin => {
      skin.querySelector('svg').style.display = 'none'
    })
  }

  showSkin (index, { opacity = 1 } = {}) {
    const skinEl = this.refs.skins[index]
    if (!skinEl) return
    skinEl.querySelector('svg').style.display = ''
    skinEl.querySelector('svg').style.opacity = opacity.toFixed(2)
  }
}
