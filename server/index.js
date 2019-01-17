#!/usr/bin/env node
require('module-alias/register')

const configuration = require('@configuration')
const fs = require('fs-extra')
const path = require('path')
const rest = require('@server/utils/decorate-rest-action')
const WebServer = require('@server/controllers/web-server')

const server = new WebServer(configuration.host)

server.router.get('/configuration', rest((_, success) => success(configuration)))

server.router.get('/dataset/:id', rest(async (req, success) => {
  const id = req.params.id
  const files = {}
  await Promise.all(configuration['datasetRequiredFiles'].map(async filename => {
    const filepath = path.join(configuration.host.datas, id, filename)
    if (!fs.existsSync(filepath)) return
    files[filename] = await fs.readFile(filepath, 'utf-8')
  }))
  return success(files)
}))

// server.router.post('/test', rest((req, success) => {
//   const data = req.body
//   if (data.test) return success(data)
//   throw new Error('Empty data')
// }))

// server.ws.on('clientQuit', client => console.log('Has quit', client))
// server.ws.on('echo', data => {
//   console.log('echo', data)
//   server.ws.broadcast('echo', data)
// })
