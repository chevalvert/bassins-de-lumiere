import iddlers from 'controllers/iddlers'
import store from 'controllers/store'
import Strate from 'abstractions/HardwareStrate'
import ws from 'controllers/websocket'

store.watch('minProgressPercent', update)
store.watch('maxProgressPercent', update)
store.watch('aperture', update)
store.watch('heading', update)
iddlers.on('update', update)

function update () {
  if (store.get('iddle')) {
    ws.send('strates', store.get('iddlers').map(iddler => {
      return Strate({
        aperture: iddler.aperture,
        heading: (iddler.headingPercent + 10) % 1,
        position: iddler.position,
        color: iddler.color
      })
    }))
  } else {
    const yrange = [
      store.get('minProgressPercent'),
      store.get('maxProgressPercent')
    ].sort((a, b) => a - b)

    ws.send('strate', Strate({
      aperture: store.get('aperture'),
      heading: store.get('heading'),
      position: yrange[0],
      thickness: Math.floor((yrange[1] - yrange[0]) * window.configuration['hardware'].pixelsHeight)
    }))
  }
}
