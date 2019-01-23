import getHost from 'utils/get-host'

/* global Image */

const CACHED = {}
if (!window.isProduction) window.cached = CACHED

export default (...files) => {
  const host = getHost()

  // TODO: queue calls instead of parallel
  files.forEach(filename => {
    CACHED[filename] = new Image()
    CACHED[filename].src = host + '/' + filename
  })
}
