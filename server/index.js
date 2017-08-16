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
    leagues   = require('./api/leagues')


const app = express();
const apiHeader = '' // '/api'

// auth0
const jwt = require('express-jwt')
const jwksRsa = require('jwks-rsa')
const jwtAuthz = require('express-jwt-authz')

// Authentication middleware. When used, the
// access token must exist and be verified against
// the Auth0 JSON Web Key Set
const checkJwt = jwt({
  // Dynamically provide a signing key
  // based on the kid in the header and 
  // the singing keys provided by the JWKS endpoint.
  secret: jwksRsa.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: `https://warning-track.auth0.com/.well-known/jwks.json`
  }),

  // Validate the audience and the issuer.
  audience: 'http://localhost:8000/',
  issuer: `https://warning-track.auth0.com/`,
  algorithms: ['RS256']
})

const checkScopes = jwtAuthz([ 'read:players', 'read:diamonds' ]);

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

app.get(apiHeader + '/players', checkJwt, checkScopes, players.findAll);
app.get(apiHeader + '/players/:id', checkJwt, checkScopes, players.findById);
app.post(apiHeader + '/players', checkJwt, checkScopes, players.addPlayer);
app.put(apiHeader + '/players/:id', checkJwt, checkScopes, players.updatePlayer);
app.delete(apiHeader + '/players/:id', checkJwt, checkScopes, players.deletePlayer);

app.get(apiHeader + '/teams', checkJwt, checkScopes, teams.findAll);
app.get(apiHeader + '/teams/:id', checkJwt, checkScopes, teams.findById);
app.post(apiHeader + '/teams', checkJwt, checkScopes, teams.addTeam);
app.put(apiHeader + '/teams/:id', checkJwt, checkScopes, teams.updateTeam);
app.delete(apiHeader + '/teams/:id', checkJwt, checkScopes, teams.deleteTeam);

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
