'use strict'
const os = require('os')
const express = require('express')
const portfinder = require('portfinder')
const path = require('path')
const serveStatic = require('serve-static')
let app = express()
let addresses = getIPAddresses()
app.use(require('morgan')('dev'))
app.use(require('./webpack'))

app.use('/', serveStatic(path.join(__dirname, '../public')))
console.log(path.join(__dirname, '../public'))
portfinder.getPort(function (err, port) {
  if (err) {
    console.error(err)
    throw err
  }
  app.listen(port, '0.0.0.0', function () {
    console.log('server available at:')
    addresses.forEach(function (address) {
      console.log('\thttp://' + address + ':' + String(port))
    })
  })
})
function getIPAddresses () {
  let result = []
  let ifaces = os.networkInterfaces()
  Object.keys(ifaces).forEach(function (ifname) {
    let alias = 0
    ifaces[ifname].forEach(function (iface) {
      if ('IPv4' !== iface.family || iface.internal !== false) {
        return
      }
      result.push(iface.address)
    })
  })
  return result
}
