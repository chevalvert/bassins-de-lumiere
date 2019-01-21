#!/usr/bin/env node
require('module-alias/register')

const configuration = require('@configuration')
const exec = require('util').promisify(require('child_process').exec)
const fs = require('fs-extra')
const geoJson = require('@tmcw/togeojson')
const path = require('path')
const { DOMParser } = require('xmldom')

const args = {
  flipCoordinates: configuration['flip-coordinates'],
  extractStreetview: configuration['extract-streetview']
}

const dataset = {
  name: configuration['dataset'],
  path: path.join(configuration.host['datas'], configuration['dataset']),
  file: function (filename) {
    return path.join(this.path, filename)
  }
}

;(async function () {
  try {
    const parser = new DOMParser()
    const kmlContent = await fs.readFile(dataset.file('features.kml'), 'utf-8')
    const kmlDOM = parser.parseFromString(kmlContent, 'text/xml')

    const json = geoJson.kml(kmlDOM)

    if (args.flipCoordinates) {
      json.features = json.features.map(f => {
        f.geometry.coordinates = f.geometry.coordinates.reverse()
        return f
      })
    }

    if (args.extractStreetview) {
      for (let i = 0; i < json.features.length; i++) {
        const f = json.features[i]
        const output = dataset.file('spheres/' + f.properties.gid + '.png')
        const cmd = `npx extract-streetview ${f.geometry.coordinates} --zoom 4 --output=${output}`
        console.log(cmd)
        const { stdout, stderr } = await exec(cmd, { cwd: process.cwd() })
        console.log(stdout)
        console.error(stderr)
      }
    }

    await fs.writeJson(dataset.file('features.json'), json.features, { spaces: 2 })
  } catch (err) {
    console.error(err)
  }
})()
