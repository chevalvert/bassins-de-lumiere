import Emitter from 'tiny-emitter'

/* global Image */

const events = new Emitter()
const NS = '__CACHE.'
const cached = {}
const queued = {}
let queueIsProcessing = false

if (!window.isProduction) {
  window.cache = cached
}

const queue = url => new Promise(resolve => {
  queued[url] = url
  cached[NS + url] = new Image()
  if (!queueIsProcessing) processQueue()
  events.once(url, resolve)
})

const load = async url => new Promise(resolve => {
  cached[NS + url].onload = function () {
    events.emit(url)
    resolve()
  }
  cached[NS + url].src = url
})

async function processQueue () {
  document.body.classList.add('is-loading')
  while (Object.keys(queued).length) {
    queueIsProcessing = true
    const current = Object.keys(queued)[0]
    await load(current)
    delete queued[current]
  }
  queueIsProcessing = false
  document.body.classList.remove('is-loading')
}

export default {
  load: (...urls) => urls.forEach(queue),
  get: url => cached[NS + url]
}
