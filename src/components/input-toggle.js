import cuid from 'cuid'
import html from 'nanohtml'
import Input from 'abstractions/Input'

export default class InputToggle extends Input {
  constructor ({
    value = true,
    storeKey,
    label = null,
    tooltip = value => value
  } = {}) {
    super({ value, storeKey })

    this.id = cuid()
    this.label = label
    this.tooltip = tooltip
  }

  render () {
    this.refs.label = html`
    <label class='input-toggle__label' for='${this.id}'>
      ${this.label}
    </label>`

    this.refs.input = html`
    <input
      id='${this.id}'
      class='input-toggle__input'
      type='checkbox'
      checked='${this.defaultValue}'
      oninput=${e => !this.disabled && this.onchange(e, this)}
      onchange=${e => !this.disabled && this.onchange(e, this)}
    />`

    return html`
    <div class='input-toggle'>
      ${this.label && this.refs.label}
      ${this.refs.input}
      <label class='input-toggle__output' for='${this.id}'></label>
    </div>`
  }

  set value (value) {
    if (!this.mounted) return
    this.refs.input.checked = value
    this.onchange()
  }

  get value () {
    return this.mounted && this.refs.input.checked
  }
}
