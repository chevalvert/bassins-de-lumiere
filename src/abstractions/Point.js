import boundingBox from 'utils/bounding-box'
import cache from 'controllers/cache'
import getSvgPolygonPoints from 'utils/get-svg-polygon-points'
import host from 'utils/host'
import normalize2d from 'utils/normalize-2d-point'

export default class Point {
  constructor (svgGroup, features) {
    this.shapeEl = svgGroup.querySelector('polygon.shape')
    this.circleEl = svgGroup.querySelector('polygon.circle')
    if (!this.shapeEl || !this.circleEl) {
      throw new Error('Badly formatted svg group')
    }

    this.features = features
    if (!this.features) {
      throw new Error('Point should have a valid GeoJON feature object')
    }

    // NOTE: this allow setting CSS stroke-width in real pixels units
    // SEE: https://stackoverflow.com/a/1304602
    this.shapeEl.setAttribute('vector-effect', 'non-scaling-stroke')
    this.circleEl.setAttribute('vector-effect', 'non-scaling-stroke')

    this.index = [...svgGroup.parentNode.children].indexOf(svgGroup)
    this.shape = getSvgPolygonPoints(this.shapeEl)
    this.circle = getSvgPolygonPoints(this.circleEl)
    this.aabb = boundingBox(this.circle)

    this.normalizedShape = [...this.shape].map(p => normalize2d(p, this.aabb, { keepAspectRatio: true }))
  }

  get position () { return this.aabb.center }
  get hasPanorama () { return this.features && this.features.properties && !!this.features.properties.panorama }
  get panorama () {
    return cache.get(host + '/' + this.features.properties.panorama)
  }

  createViewBox ({ padding = 0 } = {}) {
    return [
      this.aabb.xmin - padding,
      this.aabb.ymin - padding,
      this.aabb.width + padding * 2,
      this.aabb.height + padding * 2
    ].map(v => v.toFixed(2)).join(' ')
  }
}
