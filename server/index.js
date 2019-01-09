#!/usr/bin/env node
require('module-alias/register')

const configuration = require('@configuration')
const WebServer = require('@server/controllers/web-server')

const server = new WebServer(configuration.server)

server.ws.on('clientQuit', client => console.log('Has quit', client))

server.ws.on('echo', data => {
  console.log('echo', data)
  server.ws.broadcast('echo', data)
})
