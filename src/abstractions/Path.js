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
    this.memoizedAngles = {}
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
  get current () { return this.points.slice(...this.currentPointsIndexesRange) }
  get currentPointsIndexesRange () {
    return [
      Math.floor(store.get('minProgressPercent') * (this.points.length - 1)),
      Math.floor(store.get('maxProgressPercent') * (this.points.length - 1))
    ].sort((a, b) => a - b)
  }

  lerp (t) {
    const { x, y } = this.lerper.lerp(t)
    return [x, y]
  }

  angle (t) {
    t = parseFloat(t.toFixed(2))

    if (this.memoizedAngles[t]) return this.memoizedAngles[t]

    const index = Math.ceil(t * (this.points.length - 1))
    let a = this.points[index]
    let b = this.points[index + 1]

    if (!a) return 0

    if (!b) {
      a = this.points[index - 1]
      b = this.points[index]
    }

    const angle = angleBetweenTwoPoints(a, b)
    this.memoizedAngles[t] = angle

    return angle
  }
}
