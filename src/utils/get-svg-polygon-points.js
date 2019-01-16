export default svgPolygon => {
  const pointsAttribute = svgPolygon.getAttribute('points')
  if (!pointsAttribute) throw new Error('No points attributes found in polygon')

  return pointsAttribute
    .replace(/(\r\n|\n|\r|\t)/gm, '')
    .split(' ')
    .map(point =>
      point.split(',').map(v => +v)
    )
}
