import 'nodelist-foreach'
import raw from 'nanohtml/raw'
import normalizeSvgElement from 'utils/normalize-svg-element'

export default class Shapefile {
  constructor (shapefileContent) {
    this.raw = shapefileContent

    const svg = raw(shapefileContent)[0]

    const path = normalizeSvgElement(svg.querySelector('#path'))
    console.log(path)

    document.body.appendChild(path)

    // this.parsed = parse(shapefileContent, { generalize: true })
    // console.log(this.parsed)
  }
}
