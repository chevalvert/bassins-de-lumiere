#!/usr/bin/env node
require('module-alias/register')

const configuration = require('@configuration')
const fs = require('fs-extra')
const hardware = require('@server/controllers/hardware')
const makeAbsolute = require('@server/utils/make-path-absolute')
const path = require('path')
const rest = require('@server/utils/decorate-rest-action')
const WebServer = require('@server/controllers/web-server')

const dataset = {
  path: makeAbsolute(configuration['dataset']),
  files: {}
}

const server = new WebServer(configuration.host)
const READABLE_FILE_EXTENSIONS = ['.json', '.svg', '.kml', '.txt']

server.router.get('/configuration', rest((_, success) => success(configuration)))
server.app.use('/panoramas', server.express.static(path.join(dataset.path, 'panoramas')))
server.router.get('/dataset', rest(async (req, success) => {
  dataset.package = await fs.readJson(path.join(dataset.path, 'package.json'))

  await Promise.all(Object.entries(dataset.package.files).map(async ([key, filename]) => {
    const filepath = path.join(dataset.path, filename)
    const ext = path.extname(filename)
    if (~READABLE_FILE_EXTENSIONS.indexOf(ext)) {
      dataset.files[key] = await fs.readFile(filepath, 'utf-8')
    } else {
      dataset.files[key] = 'assets/' + filename
      server.app.use('/assets/' + filename, server.express.static(filepath))
    }
  }))
  return success(dataset)
}))

server.ws.on('echo', data => {
  console.log('echo', data)
  server.ws.broadcast('echo', data)
})

// server.router.post('/test', rest((req, success) => {
//   const data = req.body
//   if (data.test) return success(data)
//   throw new Error('Empty data')
// }))

hardware.raf(hardware.clear)
server.ws.on('strate', strate => hardware.setStrate(strate))
server.ws.on('strates', strates => hardware.setStrates(strates))
