#!/usr/bin/env node
require('module-alias/register')

const configuration = require('@configuration')
const fs = require('fs-extra')
const makeAbsolute = require('@server/utils/make-path-absolute')
const path = require('path')
const rest = require('@server/utils/decorate-rest-action')
const WebServer = require('@server/controllers/web-server')

const server = new WebServer(configuration.host)

server.router.get('/configuration', rest((_, success) => success(configuration)))

server.router.get('/dataset', rest(async (req, success) => {
  // TODO: validate dataset

  const dataset = {
    path: makeAbsolute(configuration['dataset']),
    files: {}
  }

  dataset.package = await fs.readJson(path.join(dataset.path, 'package.json'))

  await Promise.all(Object.entries(dataset.package.files).map(async ([key, filename]) => {
    const filepath = path.join(dataset.path, filename)
    dataset.files[key] = await fs.readFile(filepath, 'utf-8')
  }))

  return success(dataset)
}))

server.router.get('/dataset/pano/:id', rest(async (req, success) => {
  const id = req.body.id
  console.log('TODO', '/dataset/pano/:id', id)
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
