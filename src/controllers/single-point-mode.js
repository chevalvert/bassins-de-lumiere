import store from 'controllers/store'

store.watch('singlePointMode', single => {
  if (single) {
    store.watch('maxProgressPercent', routeValue, { immediate: true })
  } else {
    store.unwatch('maxProgressPercent', routeValue)
    store.set('minProgressPercent', 0)
    store.set('maxProgressPercent', 1)
  }
})

function routeValue (v) {
  store.set('minProgressPercent', v)
}
