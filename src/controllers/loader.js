import LogScreen from 'components/log-screen'
import rest from 'controllers/rest'
import Shapefile from 'abstractions/Shapefile'
import store from 'controllers/store'
import error from 'controllers/error'

const screen = new LogScreen({
  title: 'Chargement',
  state: 'log'
})

export default async (callback) => {
  try {
    screen.mount(document.body)

    screen.log('configuration')
    window.configuration = await rest.get('configuration')

    screen.log('shapefile')
    const shapefile = new Shapefile(await rest.get('shapefile/vert1'))
    console.log(shapefile)

    store.set('points', shapefile.points)

    screen.destroy()
    callback()
  } catch (err) {
    error(err)
  }
}
