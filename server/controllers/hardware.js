const configuration = require('@configuration')
const serialed = require('serialed')

const ctrlr = new serialed.SerialedController()
const width = configuration['hardware'].pixelsWidth
const height = configuration['hardware'].pixelsHeight

let strates = []
let observers = []
let now = Date.now()
let last = now

ctrlr.on('next', () => {
  now = Date.now()
  for (let i = 0; i < observers.length; i++) observers[i](now - last)
  strates.forEach(drawStrate)
  last = now
})

process.on('SIGINT', kill)
process.on('SIGTERM', kill)
process.on('uncaughtException', err => {
  console.error(err)
  kill()
})

function kill () {
  ctrlr.close()
  process.exit(1)
}

function drawStrate (strate) {
  for (let x = strate.xmin; x <= strate.xmax; x++) {
    for (let y = strate.ymin; y <= strate.ymax; y++) {
      safePixel(x, y, strate.color)
    }
  }
}

function safePixel (x, y, rgb = configuration['hardware'].white) {
  if (configuration['hardware'].direction < 0) y = (height - 1) - y
  // NOTE: x % width is natively handled in serialed
  if (y < 0 || y >= height) return
  ctrlr.pixel(x, y, ...rgb)
}

module.exports = {
  kill,
  pixel: safePixel,
  clear: ctrlr.clear.bind(ctrlr),

  // NOTE:
  // Using hardware.setStrate will clear every other strate.
  // To send multiple strates, use the hardware.setStrates.
  setStrate: ({ xmin, xmax, ymin, ymax, color }) => {
    strates = [{ xmin, xmax, ymin, ymax, color }]
  },

  setStrates: _strates => {
    strates = _strates
  },

  raf: fn => {
    if (typeof fn === 'function' && !~observers.indexOf(fn)) {
      observers.push(fn)
    }
  },

  remove: fn => {
    let index = observers.indexOf(fn)
    if (index >= 0) observers.splice(index, 1)
  }
}
