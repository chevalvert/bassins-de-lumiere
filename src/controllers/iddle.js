import store from 'controllers/store'
import 'controllers/iddlers'

let waitForIddleness

function reset () {
  store.set('iddle', false)
  clearTimeout(waitForIddleness)
  waitForIddleness = setTimeout(() => {
    store.set('iddle', true)
  }, window.configuration['iddleAfter'])
}

store.watch('currentPointA', reset)
store.watch('currentPointB', reset)
store.watch('currentPointC', reset)
store.watch('heading', reset)
store.watch('aperture', reset)

export default { reset }
