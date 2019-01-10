import ws from 'controllers/websocket'
import rest from 'controllers/rest'

Promise.resolve()
  .then(() => rest.get('configuration'))
  .then(configuration => {
    window.configuration = configuration
    document.title = `[${window.configuration.package.version}] ${document.title}`
    console.log(configuration)
  })
  .catch(console.error)

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
