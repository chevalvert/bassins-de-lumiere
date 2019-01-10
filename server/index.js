#!/usr/bin/env node
require('module-alias/register')

const configuration = require('@configuration')
const WebServer = require('@server/controllers/web-server')
const rest = require('@server/utils/decorate-rest-action')

const server = new WebServer(configuration.server)

// server.ws.on('clientQuit', client => console.log('Has quit', client))

server.router.get('/configuration', rest(() => configuration))
server.router.post('/test', rest((req, success) => {
  const data = req.body
  if (data.test) return success(data)
  throw new Error('Empty data')
}))

server.ws.on('echo', data => {
  console.log('echo', data)
  server.ws.broadcast('echo', data)
})
