import { lerp } from 'missing-math'
import store from 'controllers/store'

export default class Iddler {
  constructor () {
    this.speed = lerp(...window.configuration['iddlerSpeedRange'], Math.random())
    this.aperture = 120
    this.direction = Math.random() > 0.5 ? -1 : 1
    this.position = 0.5 - this.direction * 0.5
  }

  update () {
    this.position += this.speed * this.direction
    this.pointIndex = Math.floor(this.position * store.get('points').length)
  }

  get mustDie () {
    return this.position < 0 || this.position > 1
  }
}
