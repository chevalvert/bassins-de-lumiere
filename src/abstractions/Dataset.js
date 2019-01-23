/**
 * A convenient abstraction to wrap all file parsing, sanitization etc for a given dataset
 */

import 'nodelist-foreach'
import Map from 'abstractions/Map'
import Path from 'abstractions/Path'
import Point from 'abstractions/Point'
import raw from 'nanohtml/raw'

export default class Dataset {
  constructor (dataset) {
    Object.entries(dataset.package).forEach(([key, value]) => {
      this[key] = value
    })

    this.files = dataset.files

    this.parseShapes(this.files['shapes'])
    this.parseMap(this.files['map'])
    this.path = new Path(this.points)
  }

  parseShapes (shapes) {
    const shapesElement = [...raw(shapes)].find(el => el.nodeName === 'svg')
    const groups = shapesElement.querySelectorAll('g')
    this.points = [...groups].map(group => new Point(group))
  }

  parseMap (map) {
    const mapElement = [...raw(map)].find(el => el.nodeName === 'svg')
    this.map = new Map(mapElement)
  }
}
