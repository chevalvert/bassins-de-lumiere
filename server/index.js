#!/usr/bin/env node
require('module-alias/register')

const configuration = require('@configuration')
const fs = require('fs')
const path = require('path')
const rest = require('@server/utils/decorate-rest-action')
const WebServer = require('@server/controllers/web-server')

const server = new WebServer(configuration.host)

// server.ws.on('clientQuit', client => console.log('Has quit', client))

server.router.get('/configuration', rest(() => configuration))

server.router.get('/shapefile/:id', rest(req => {
  const filename = req.params.id + '.svg'
  const filepath = path.join(configuration.host.dist, filename)
  return fs.readFileSync(filepath, 'utf-8')
}))

server.router.post('/test', rest((req, success) => {
  const data = req.body
  if (data.test) return success(data)
  throw new Error('Empty data')
}))

server.ws.on('echo', data => {
  console.log('echo', data)
  server.ws.broadcast('echo', data)
})
