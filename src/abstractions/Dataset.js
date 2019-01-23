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

    const shapesElement = [...raw(this.files.shapes)].find(el => el.nodeName === 'svg')
    const mapElement = [...raw(this.files.map)].find(el => el.nodeName === 'svg')

    const svgGroups = shapesElement.querySelectorAll('g')

    this.map = new Map(mapElement)
    this.features = JSON.parse(this.files.features)
    this.panoramas = this.features.map(f => f.properties.panorama).filter(Boolean)
    this.points = [...svgGroups].map((svgGroup, index) => {
      const feature = this.features.find(f => +f.properties.gid === index)
      return new Point(svgGroup, feature)
    })
    this.path = new Path(this.points)
  }
}
