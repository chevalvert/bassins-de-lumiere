import distSq from 'utils/distance-squared'
import html from 'nanohtml'
import Input from 'abstractions/Input'
import store from 'controllers/store'
import { clamp, normalize, lerp } from 'missing-math'
import { raf } from '@internet/raf'

export default class InputHandle extends Input {
  constructor ({
    value = 0,
    storeKey
  } = {}) {
    super({ value, storeKey })
  }

  onchange (e, t) {
    super.onchange(e, t)
    this.update()
  }

  render () {
    return html`
    <div class='input-handle'>
      <div class='input-handle__thumb'/>
    </div>`
  }

  didMount () {
    super.didMount()
    this.bindFuncs(['startMove', 'stopMove', 'move', 'update', 'targetCursor'])

    this.refs.base.addEventListener('mousedown', this.startMove, false)
    this.refs.base.addEventListener('touchstart', this.startMove, false)
    window.addEventListener('mouseup', this.stopMove, false)
    window.addEventListener('touchend', this.stopMove, false)
    window.addEventListener('touchcancel', this.stopMove, false)
    window.addEventListener('mousemove', this.move, false)
    window.addEventListener('touchmove', this.move, false)
    window.addEventListener('resize', this.update, false)

    this.update()
  }

  willUnmount () {
    super.willUnmount()
    raf.remove(this.update)
    this.refs.base.removeEventListener('mousedown', this.startMove)
    this.refs.base.removeEventListener('touchstart', this.startMove)
    window.removeEventListener('mouseup', this.stopMove)
    window.removeEventListener('touchend', this.stopMove)
    window.removeEventListener('touchcancel', this.stopMove)
    window.removeEventListener('mousemove', this.move)
    window.removeEventListener('touchmove', this.move)
    window.removeEventListener('resize', this.update, false)
  }

  startMove (e) {
    e.preventDefault()
    // TODO: handle multitouch correctly
    this.moving = true
    this.touch = e.changedTouches && e.changedTouches[0].identifier
    this.target = this.touch
      ? [e.changedTouches[0].pageX, e.changedTouches[0].pageY]
      : [e.pageX, e.pageY]

    raf.add(this.targetCursor)
    this.addClass('is-active')
    document.body.classList.add('has-grabbing')
  }

  stopMove () {
    if (!this.moving) return
    this.moving = false
    this.touch = null
    this.removeClass('is-active')
    document.body.classList.remove('has-grabbing')
    raf.remove(this.targetCursor)
  }

  move (e) {
    if (!this.moving) return
      this.target = [e.pageX, e.pageY]

    // TODO: handle multitouch correctly
    if (!e.changedTouches || !this.touch) return
    for (let i = 0; i < e.changedTouches.length; i++) {
      const touch = e.changedTouches[i]
      if (touch.target !== this.touch) continue
      this.target = [touch.pageX, touch.pageY]
    }
  }

  targetCursor () {
    const path = store.get('path')
    const width = this.refs.base.parentNode.clientWidth
    const height = this.refs.base.parentNode.clientHeight

    let result
    let shortestDistance = Number.POSITIVE_INFINITY
    for (let t = 0; t < 1; t += 0.01) {
      const normalizedCandidate = path.lerp(t)
      const candidate = [
        normalizedCandidate[0] * width,
        normalizedCandidate[1] * height
      ]
      const distance = distSq(candidate, this.target)
      if (distance < shortestDistance) {
        shortestDistance = distance
        result = t
      }
    }

    const adaptativeEasingFactor = normalize(shortestDistance, 0, 5000)
    const adaptativeEasing = lerp(...window.configuration['pathHandlesAdaptiveEasingRange'], clamp(adaptativeEasingFactor, 0, 1))
    this.value += (result - this.value) * adaptativeEasing

    this.onchange(null, this)
  }

  update () {
    if (!this.mounted) return
    window.requestAnimationFrame(() => {
      const [x, y] = this.position
      this.refs.base.style.transform = `translate(${x.toFixed(3)}px, ${y.toFixed(3)}px)`
    })
  }

  set value (value) {
    this._value = clamp(value, 0, 1)
    this.onchange()
  }

  get value () {
    return this._value
  }

  get normalizedPosition () {
    return store.get('path').lerp(this.value)
  }

  get position () {
    return [
      this.normalizedPosition[0] * this.refs.base.parentNode.clientWidth,
      this.normalizedPosition[1] * this.refs.base.parentNode.clientHeight
    ]
  }
}
