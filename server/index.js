'use strict'
const os = require('os')
const express = require('express')
const bodyParser = require('body-parser')
const portfinder = require('portfinder')
const path = require('path')
const serveStatic = require('serve-static')

const players = require('./api/players'),
    teams   = require('./api/teams'),
    games   = require('./api/games'),
    diamonds   = require('./api/diamonds'),
    leagues   = require('./api/leagues'),
    images = require('./api/images')

let app = express();

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }))

// parse application/json
app.use(bodyParser.json({limit: '50mb'}))

app.get('/players', players.findAll);
app.get('/players/:id', players.findById);
app.post('/players', players.addPlayer);
app.put('/players/:id', players.updatePlayer);
app.delete('/players/:id', players.deletePlayer);

app.get('/teams', teams.findAll);
app.get('/teams/:id', teams.findById);
app.post('/teams', teams.addTeam);
app.put('/teams/:id', teams.updateTeam);
app.delete('/teams/:id', teams.deleteTeam);

app.get('/games', games.findAll);
app.get('/games/:id', games.findById);
app.post('/games', games.addGame);
app.put('/games/:id', games.updateGame);
app.delete('/games/:id', games.deleteGame);

app.get('/diamonds', diamonds.findAll);
app.get('/diamonds/:id', diamonds.findById);
app.post('/diamonds', diamonds.addDiamond);
app.put('/diamonds/:id', diamonds.updateDiamond);
app.delete('/diamonds/:id', diamonds.deleteDiamond);

app.get('/leagues', leagues.findAll);
app.get('/leagues/:id', leagues.findById);
app.post('/leagues', leagues.addLeague);
app.put('/leagues/:id', leagues.updateLeague);
app.delete('/leagues/:id', leagues.deleteLeague);

app.post('/images', images.uploadImage);
app.delete('/images/delete', images.deleteImage);

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
