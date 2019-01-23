import cache from 'controllers/cache'
import Dataset from 'abstractions/Dataset'
import error from 'controllers/error'
import host from 'utils/host'
import LogScreen from 'components/log-screen'
import rest from 'controllers/rest'
import store from 'controllers/store'

const screen = new LogScreen({
  title: window.configuration['html'].title,
  state: 'loading'
})

export default async () => {
  try {
    screen.mount(document.body)

    screen.setMessage(null, { progress: 0.2 })
    window.configuration = await rest.get('configuration')

    screen.setMessage(null, { progress: 0.6 })

    const dataset = new Dataset(await rest.get('dataset'))
    store.set('points', dataset.points)
    store.set('path', dataset.path)
    store.set('map', dataset.map)

    cache.load(...dataset.panoramas.map(filename => host + '/' + filename))

    screen.setMessage(null, { progress: 1 })
    await new Promise(resolve => setTimeout(resolve, 500))

    screen.destroy()
  } catch (err) {
    error(err)
  }
}
