import LogScreen from 'components/log-screen'
import rest from 'controllers/rest'
import Dataset from 'abstractions/Dataset'
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

    screen.log('dataset')
    const datasetFiles = await rest.get('dataset/' + window.configuration['dataset'])
    const dataset = new Dataset(datasetFiles)
    store.set('points', dataset.points)
    store.set('path', dataset.path)
    store.set('map', dataset.map)

    screen.destroy()
    callback()
  } catch (err) {
    error(err)
  }
}
