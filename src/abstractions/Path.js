import angleBetweenTwoPoints from 'utils/angle-between-two-points'
import lastOf from 'utils/array-last'
import nudged from 'nudged'
import PathLerp from 'path-lerp'
import store from 'controllers/store'

export default class Path {
  constructor (points) {
    this.rawPoints = points.map(point => point.position)
    this.anchors = [this.rawPoints[0], lastOf(this.rawPoints)]

    this.points = [...this.rawPoints]
    this.lerper = new PathLerp(this.points.map(p => ({x: p[0], y: p[1]})))

    store.watch('map', map => {
      this.fit(map.normalizedAnchors)
    })
  }

  fit ([a, b]) {
    // SEE: https://github.com/axelpale/nudged
    const matrix = nudged.estimate('TSR', this.anchors, [a, b])
    this.points = matrix.transform([...this.rawPoints])
    this.lerper = new PathLerp(this.points.map(p => ({x: p[0], y: p[1]})))
  }

  get all () { return this.points }
  get current () {
    const pointsIndexesRange = [
      Math.floor(store.get('currentPointA') * this.points.length),
      Math.floor(store.get('currentPointB') * this.points.length)
    ].sort((a, b) => a - b)

    return this.points.slice(...pointsIndexesRange)
  }

  lerp (t) {
    const { x, y } = this.lerper.lerp(t)
    return [x, y]
  }

  angle (t) {
    const index = Math.floor(t * (this.points.length - 1))
    let a = this.points[index]
    let b = this.points[index + 1]

    if (!b) {
      a = this.points[index - 1]
      b = this.points[index]
    }

    return angleBetweenTwoPoints(a, b)
  }
}
