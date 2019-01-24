import normalize2d from 'utils/normalize-2d-point'

export default class Map {
  constructor (svgElement) {
    this.element = svgElement
    if (!this.element) throw new Error('Badly formatted svg group')
    this.element.setAttribute('vector-effect', 'non-scaling-stroke')

    const viewBox = this.element.getAttribute('viewBox')
    if (!viewBox) throw new Error('Map svg must contain a viewBox attribute')
    this.viewBox = viewBox.split(' ').map(v => +v)

    const anchors = ['#from', '#to'].map(id => this.element.querySelector(id))
    if (anchors.some(a => !a)) throw new Error('Map svg must contain <path id="from" d=""/> and <path id="to" d=""/> elements')
    this.anchors = anchors.map(svgPath => {
      const pathAttribute = svgPath.getAttribute('d')
      if (!pathAttribute) throw new Error('Expected map anchors to be svg <path d=""/>, found ' + svgPath.outerHTML)
      return pathAttribute.split(',').map(v => +v.replace(/[^\d.-]/g, ''))
    })

    this.normalizedAnchors = [...this.anchors].map(p => normalize2d(p, this.aabb))
  }

  get aabb () {
    if (!this._aabb) {
      this._aabb = {
        xmin: this.viewBox[0],
        ymin: this.viewBox[1],
        xmax: this.viewBox[0] + this.viewBox[2],
        ymax: this.viewBox[1] + this.viewBox[3],
        width: this.viewBox[2],
        height: this.viewBox[3],
        center: [
          this.viewBox[0] + this.viewBox[2] / 2,
          this.viewBox[1] + this.viewBox[3] / 2
        ]
      }
    }
    return this._aabb
  }
}
