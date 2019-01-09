const fs = require('fs')
const path = require('path')
const pckg = require('package')(module)
const resolvePath = require('@server/utils/resolve-configuration-paths')

const appname = pckg.name
process.title = appname

const defaultConfigPath = path.join(__dirname, '..', '.apprc')
const defaultConfig = JSON.parse(fs.readFileSync(defaultConfigPath, 'utf-8'))
const configuration = require('rc')(appname, defaultConfig)

configuration.host.dist = resolvePath(configuration.host.dist)

configuration.appname = appname
configuration.package = pckg
configuration.help = configuration.help || configuration.h
configuration.version = configuration.version || configuration.v

// Show help
if (configuration.help) {
  console.log(fs.readFileSync(path.join(__dirname, 'USAGE'), 'utf-8'))
  process.exit(0)
}

// Show version
if (configuration.version) {
  console.log(configuration.package.version)
  process.exit(0)
}

module.exports = configuration
