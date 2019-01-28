import { lerp, random, noise } from 'missing-math'
import store from 'controllers/store'

export default class Iddler {
  constructor () {
    this.speed = lerp(...window.configuration['iddlerSpeedRange'], Math.random())
    this.seed = random(1000)
    this.aperture = 120 / 360
    this.direction = Math.random() > 0.5 ? -1 : 1
    this.position = 0.5 - this.direction * 0.5
    this.heading = this.targetHeading
    this.color = [
      Math.floor(Math.random() * 10),
      Math.floor(Math.random() * 10),
      Math.floor(Math.random() * 10)
    ]
  }

  get targetHeading () {
    return store.get('path').angle(this.position) - (Math.PI / 2) + ((Math.PI / 2) * this.direction)
  }

  get headingPercent () {
    return this.heading / (Math.PI * 2)
  }

  get pointIndex () {
    return Math.floor(this.position * store.get('points').length)
  }

  get offset () {
    return [
      noise(this.position, this.seed * 2),
      noise(this.position, this.seed * 3)
    ]
  }

  get mustDie () {
    return this.position < 0 || this.position > 1
  }

  update () {
    this.position += this.speed * this.direction
    this.heading += (this.targetHeading - this.heading) * 0.5
  }
}
