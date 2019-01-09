const cors = require('cors')
const Emitter = require('tiny-emitter')
const express = require('express')
const findFirstAvailableAddress = require('@server/utils/find-first-available-network-address')
const path = require('path')
const WebsocketServer = require('@server/controllers/websocket-server')

module.exports = class WebServer extends Emitter {
  constructor ({
    port = 8888,
    dist = path.join(__dirname, '..', '..', 'build'),
    enableWebsocket = true
  } = {}) {
    super()

    this.port = port
    this.dist = dist

    const app = express()
    this.router = express.Router()

    app.use(express.static(dist, { extensions: ['html'] }))
    app.use(express.json())
    app.use(cors({ credentials: true, origin: true }))
    app.use('/api', this.router)

    this.server = app.listen(port, () => {
      const address = findFirstAvailableAddress()
      const url = `http://${address}:${port}`
      console.log(`Listening to ${url}`)
    })

    if (enableWebsocket) {
      this.websocketServer = new WebsocketServer(this.server)
    }
  }

  get ws () { return this.websocketServer }
}
