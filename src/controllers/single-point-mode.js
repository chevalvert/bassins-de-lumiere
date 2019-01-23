import store from 'controllers/store'
import { clamp } from 'missing-math'

let hasAlreadyChanged = false

store.watch('singlePointMode', single => {
  if (single) {
    const min = store.get('minProgressPercent')
    const max = store.get('maxProgressPercent')
    const mid = (min + max) / 2
    store.set('minProgressPercent', mid)
    store.set('maxProgressPercent', mid)
    store.watch('maxProgressPercent', routeValue, { immediate: true })
  } else if (hasAlreadyChanged) {
    const cur = store.get('maxProgressPercent')
    store.unwatch('maxProgressPercent', routeValue)
    store.set('minProgressPercent', clamp(cur - 0.2, 0, 1))
    store.set('maxProgressPercent', clamp(cur + 0.1, 0, 1))
  }

  hasAlreadyChanged = true
})

function routeValue (v) {
  store.set('minProgressPercent', v)
}
