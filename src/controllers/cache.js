/* global Image */

const NS = '__CACHE.'
const cached = {}

if (!window.isProduction) {
  window.cache = cached
}

function load (url) {
  cached[NS + url] = new Image()
  cached[NS + url].src = url
}

export default {
  load: (...urls) => {
    // TODO: queue calls instead of parallel
    urls.forEach(load)
  },

  get: url => {
    if (!cached[NS + url]) load(url)
    return cached[NS + url]
  }
}
