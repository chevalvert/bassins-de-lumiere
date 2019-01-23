import store from 'controllers/store'
import 'controllers/iddlers'

let waitForIddleness

// TODO: no iddle when on panorama

function reset () {
  store.set('iddle', false)
  clearTimeout(waitForIddleness)
  waitForIddleness = setTimeout(() => {
    store.set('iddle', true)
  }, window.configuration['iddleAfter'])
}

store.watch('minProgressPercent', reset)
store.watch('maxProgressPercent', reset)
store.watch('heading', reset)
store.watch('aperture', reset)

export default { reset }
