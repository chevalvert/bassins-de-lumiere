import DomComponent from 'abstractions/DomComponent'
import html from 'nanohtml'

export default class LogScreen extends DomComponent {
  constructor ({
    title = '',
    message = '',
    state = 'log',
    className = undefined
  } = {}) {
    super()
    this.title = title
    this.message = message
    this.state = state
    this.className = className
  }

  render () {
    this.refs.message = html`<div class='log-screen__message'>${this.message}</div>`
    return html`
      <section class='log-screen ${this.className}' data-state='${this.state}'>
        <div class='log-screen__content'>
          <h1 class='log-screen__title'>${this.title}</h1>
          ${this.refs.message}
        </div>
      </section>`
  }

  update () {
    if (!this.mounted) return
    window.requestAnimationFrame(() => {
      this.refs.message.innerHTML = this.message
      this.refs.base.setAttribute('data-state', this.state)
    })
  }

  setMessage (message, state) {
    this.message = message
    this.state = state
    this.update()
  }

  log (message) { this.setMessage(message, 'log') }
  success (message) { this.setMessage(message, 'success') }
  warning (message) { this.setMessage(message, 'warning') }
  error (message) { this.setMessage(message, 'error') }
}
