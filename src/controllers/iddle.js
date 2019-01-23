import store from 'controllers/store'

let timer

function reset () {
  store.set('iddle', false)
  clearTimeout(timer)
  timer = setTimeout(() => {
    store.set('iddle', true)
  }, window.configuration['iddleAfter'])
}

store.watch('currentPointA', reset)
store.watch('currentPointB', reset)
store.watch('currentPointC', reset)
store.watch('heading', reset)
store.watch('aperture', reset)

export default { reset }
