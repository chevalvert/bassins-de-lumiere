import Emitter from 'tiny-emitter'
import Iddler from 'abstractions/Iddler'
import store from 'controllers/store'
import { lerp } from 'missing-math'
import { raf } from '@internet/raf'

const events = new Emitter()
const iddlers = []
let waitForSpawn

store.watch('iddle', v => v ? startSpawning() : stopSpawning())

function startSpawning () {
  events.emit('start')
  raf.add(update)
  spawn()
}

function stopSpawning () {
  events.emit('stop')
  raf.remove(update)
  clearTimeout(waitForSpawn)
  killAll()
}

function spawn () {
  const nextSpawnDelay = lerp(...window.configuration['iddlersRandomSpawnIntervalRange'], Math.random())
  clearTimeout(waitForSpawn)
  waitForSpawn = setTimeout(() => {
    iddlers.push(new Iddler())
    store.set('iddlers', iddlers)
    events.emit('spawn')
    if (iddlers.length < window.configuration['iddlersMaxLength']) spawn()
  }, nextSpawnDelay)
}

function killAll () {
  iddlers.length = 0
  store.set('iddlers', iddlers)
}

function kill (iddler) {
  const iddlerIndex = iddlers.indexOf(iddler)
  if (iddlerIndex < 0) return
  iddlers.splice(iddlerIndex, 1)
  store.set('iddlers', iddlers)
  events.emit('kill')
}

function update () {
  iddlers.forEach(iddler => {
    iddler.update()
    if (iddler.mustDie) kill(iddler)
  })
  events.emit('update')
}

export default events
