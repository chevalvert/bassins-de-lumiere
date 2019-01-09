import ws from 'controllers/websocket'

console.log('hello world')

ws.on('echo', data => console.log(data))

window.addEventListener('click', () => {
  ws.send('echo', {
    foo: 'bar'
  })
})
