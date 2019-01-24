import store from 'controllers/store'
import 'controllers/iddlers'

let waitForIddleness

// NOTE: iddle is disabled as per design when a panorama is open
// SEE: @components/Panorama.spy, which is called in raf and reset
// the iddle 60 frames per seconds by setting the stored "heading" value.

function reset () {
  store.set('iddle', false)
  clearTimeout(waitForIddleness)
  waitForIddleness = setTimeout(() => {
    store.set('iddle', true)
  }, window.configuration['iddleAfter'])
}

store.watch('aperture', reset)
store.watch('heading', reset)
store.watch('maxProgressPercent', reset)
store.watch('minProgressPercent', reset)
store.watch('panorama', reset)
store.watch('singlePointMode', reset)

export default { reset }
