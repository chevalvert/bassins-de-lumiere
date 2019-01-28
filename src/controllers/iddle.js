import store from 'controllers/store'
import 'controllers/iddlers'

let waitForIddleness

// NOTE: iddle is disabled as per design when a panorama is open
// SEE: @components/Panorama.spy, which is called in raf and reset
// the iddle 60 frames per seconds by setting the stored "heading" value.

function reset () {
  if (!window.configuration['iddleAfter'] || window.configuration['iddleAfter'] < 0) {
    return
  }

  store.set('iddle', false)
  document.body.classList.remove('is-iddle')
  clearTimeout(waitForIddleness)
  waitForIddleness = setTimeout(() => {
    store.set('iddle', true)
    document.body.classList.add('is-iddle')
  }, window.configuration['iddleAfter'])
}

store.watch('aperture', reset)
store.watch('heading', reset)
store.watch('maxProgressPercent', reset)
store.watch('minProgressPercent', reset)
store.watch('panorama', reset)
store.watch('singlePointMode', reset)

export default { reset }
