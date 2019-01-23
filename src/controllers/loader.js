import LogScreen from 'components/log-screen'
import rest from 'controllers/rest'
import Dataset from 'abstractions/Dataset'
import store from 'controllers/store'
import error from 'controllers/error'

const screen = new LogScreen({
  title: 'Chargement',
  state: 'log'
})

export default async () => {
  try {
    screen.mount(document.body)

    screen.log('configuration')
    window.configuration = await rest.get('configuration')

    screen.log('dataset')

    const dataset = new Dataset(await rest.get('dataset'))
    store.set('points', dataset.points)
    store.set('path', dataset.path)
    store.set('map', dataset.map)

    screen.destroy()
  } catch (err) {
    error(err)
  }
}
