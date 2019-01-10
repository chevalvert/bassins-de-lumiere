import ws from 'controllers/websocket'
import rest from 'controllers/rest'
import LogScreen from 'components/log-screen'

const logScreen = new LogScreen({
  title: 'Chargement',
  state: 'log'
})

;(async () => {
  logScreen.mount(document.body)
  window.configuration = await rest.get('configuration')
  document.title = `[${window.configuration.package.version}] ${document.title}`
  console.log(window.configuration)

  logScreen.log('hello')
  await new Promise(resolve => setTimeout(resolve, 1000))
  logScreen.log('world')
  await new Promise(resolve => setTimeout(resolve, 1000))

  logScreen.destroy()
})()

ws.on('echo', data => console.log(data))

window.addEventListener('click', async () => {
  try {
    const response = await rest.post('test', {
      test: true
    })
    console.log(response)
  } catch (err) {
    console.error(err)
  }

  // ws.send('echo', {
  //   foo: 'bar'
  // })
})
