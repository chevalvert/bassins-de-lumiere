import DomComponent from 'abstractions/DomComponent'
import html from 'nanohtml'
import store from 'controllers/store'

export default class PanoramasLauncher extends DomComponent {
  didMount () {
    this.bindFuncs(['update'])

    store.watch('currentPointA', this.update)
    store.watch('currentPointB', this.update)
    store.watch('currentPointC', this.update)
  }

  render () {
    return html`
    <div class='panoramas-launcher'>
      foo
    </div>`
  }

  update () {
    // const pointsIndexesRange = [
    //   Math.floor(store.get('currentPointA') * this.points.length),
    //   Math.floor(store.get('currentPointB') * this.points.length)
    // ].sort((a, b) => a - b)
    // this.refs
  }
}
