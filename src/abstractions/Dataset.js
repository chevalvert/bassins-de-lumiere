/**
 * A convenient abstraction to wrap all file parsing, sanitization etc for a given dataset
 */

import 'nodelist-foreach'
import Map from 'abstractions/Map'
import Path from 'abstractions/Path'
import Point from 'abstractions/Point'
import raw from 'nanohtml/raw'

export default class Dataset {
  static get REQUIRED_FILES () {
    return window.configuration['datasetRequiredFiles']
  }

  constructor (files) {
    this.files = files
    if (!this.checkIntegrity()) return

    this.parseShapes(files['shapes.svg'])
    this.parseMap(files['map.svg'])
    this.path = new Path(this.points)
  }

  checkIntegrity (files = this.files) {
    Dataset.REQUIRED_FILES.forEach(filename => {
      if (!files.hasOwnProperty(filename) || !files[filename]) {
        throw new ReferenceError('Missing file in dataset: ' + filename)
      }
    })
    return true
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
