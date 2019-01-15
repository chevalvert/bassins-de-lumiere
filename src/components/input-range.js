import Input from 'abstractions/Input'
import html from 'nanohtml'

export default class InputRange extends Input {
  constructor ({
    value = 0,
    storeKey,
    range = [0, 1],
    step = 0.01,
    label = null,
    fill = false,
    tooltip = value => value
  } = {}) {
    super({ value, storeKey })

    this.label = label
    this.range = range
    this.step = step
    this.fill = fill
    this.tooltip = tooltip
  }

  onchange (e, t) {
    super.onchange(e, t)
    if (!this.mounted) return
    this.refs.base.title = this.tooltip(this.value)
    if (this.fill) {
      window.requestAnimationFrame(() => {
        this.refs.filler.style.width = (this.percent * 100) + '%'
      })
    }
  }

  render () {
    this.refs.label = html`
    <label class='input-range__label'>
      ${this.label}
    </label>`

    this.refs.filler = html`<div class='input-range__filler'/>`

    this.refs.input = html`
    <input
      class='input-range__input'
      type='range'
      min='${this.range[0]}'
      max='${this.range[1]}'
      step='${this.step}'
      value='${this.defaultValue}'
      oninput=${e => !this.disabled && this.onchange(e, this)}
      onchange=${e => !this.disabled && this.onchange(e, this)}
    />`

    return html`
    <div class='input-range'>
      ${this.label ? this.refs.label : ''}
      <div class='input-range__wrapper'>
        ${this.refs.input}
        ${this.refs.filler}
      </div>
    </div>`
  }

  set value (value) {
    if (!this.mounted) return
    this.refs.input.value = value
    this.onchange()
  }

  get value () {
    return this.mounted && +this.refs.input.value
  }

  get percent () {
    return this.mounted && (+this.refs.input.value / this.range[1])
  }
}
