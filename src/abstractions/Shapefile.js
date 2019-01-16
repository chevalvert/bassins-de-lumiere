import 'nodelist-foreach'
import Point from 'abstractions/Point'
import raw from 'nanohtml/raw'

export default class Shapefile {
  constructor (shapefileContent) {
    this.raw = shapefileContent

    const svg = raw(shapefileContent)[0]
    const groups = svg.querySelectorAll('g')

    this.points = [...groups].map(group => new Point(group))
  }
}
