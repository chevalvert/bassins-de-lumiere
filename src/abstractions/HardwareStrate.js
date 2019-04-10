export default ({
  aperture = 1,
  heading = 1,
  position = 0,
  thickness = 0,
  color
}) => {
  if (aperture === undefined || heading === undefined) return

  const width = window.configuration['hardware'].pixelsWidth
  const height = window.configuration['hardware'].pixelsHeight

  // NOTE: this handles negative value :
  // -0.1 → 0.9, -0.9 → 0.1, etc…
  heading = (1 + heading) % 1

  const xrange = [
    Math.floor(heading * width),
    Math.floor((heading + aperture) * width)
  ].sort((a, b) => a - b)

  const yrange = [
    Math.floor(position * height),
    Math.floor(position * height) + thickness
  ].sort((a, b) => a - b)

  return {
    xmin: xrange[0],
    xmax: xrange[1],
    ymin: yrange[0],
    ymax: yrange[1],
    color
  }
}
