import cloneDeep from 'clone-deep'
import html from 'nanohtml'
import { normalize } from 'missing-math'
import { parse } from 'svg-parse'

function makeAbsolute (instructions) {
  let { x, y } = instructions[0].props

  x = -x
  y = -y

  return cloneDeep(instructions).map(i => {
    x += i.props.x
    y += i.props.y

    console.log([x, y])

    i.props.relative = false
    i.props.x = x
    i.props.y = y
    return i
  })
}

function computeBoundingBox (instructions) {
  const isRelative = instructions.find(i => i.props.isRelative)
  if (isRelative) return

  let xmin = Number.POSITIVE_INFINITY
  let xmax = Number.NEGATIVE_INFINITY
  let ymin = Number.POSITIVE_INFINITY
  let ymax = Number.NEGATIVE_INFINITY

  instructions.forEach(i => {
    const { x, y } = i.props
    if (x < xmin) xmin = x
    if (x > xmax) xmax = x
    if (y < ymin) ymin = y
    if (y > ymax) ymax = y
  })

  return {
    xmin,
    xmax,
    ymin,
    ymax,
    width: xmax - xmin,
    height: ymax - ymin
  }
}

function normalizeInstructions (instructions, aabb) {
  const { width, height } = aabb
  const ratio = {
    x: width > height ? 1 : height / width,
    y: width > height ? width / height : 1
  }

  return cloneDeep(instructions).map(i => {
    i.props.x = normalize(i.props.x, aabb.xmin, aabb.xmax) / ratio.x
    i.props.y = normalize(i.props.y, aabb.ymin, aabb.ymax) / ratio.y
    return i
  })
}

export default svg => {
  const id = svg.getAttribute('id')
  const svgPath = svg.getAttribute('d')
  const instructions = parse(svgPath, { generalize: true })

  const absoluteInstructions = makeAbsolute(instructions)
  const aabb = computeBoundingBox(absoluteInstructions)
  const normalizedInstructions = normalizeInstructions(absoluteInstructions, aabb)
  const normalizedPathString = normalizedInstructions.map(i => {
    return `${i.type[0].toUpperCase()}${i.props.x.toFixed(3)} ${i.props.y.toFixed(3)}`
  }).join('')

  return html`<svg
    style="fill:none;stroke:black;stroke-width:0.01px"
    width='500'
    height='500'
    viewBox='-1 -1 3 3'
  ><path id=${id} d='${normalizedPathString}'/></svg>`
}
