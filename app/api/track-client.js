'use strict'
import Promise from 'bluebird'

/*
let the app configure this plz.
Promise.config({
  warnings: true,
  longStackTraces: true,
  cancellation: true,
  monitoring: true
})
*/

// import {
//   Team,
//   Player,
//   Game,
//   League,
//   Diamond
// } from './entities'

import { wrapApiQuery } from './utils'
/**
 * Client to the report-web api
 */
class TrackClient {
  constructor (options) {
    this.$http = options.http
    this.CancelToken = options.CancelToken
  }
  /**
   * abstract get function that can attach common event properties.
   *
   * @param { string } url - the URL of the resource to fetch.
   * @return { Promise.<Object> } the eventual result of the request.
   */
  get (url, options = {}) {
    let opts = Object.assign({}, options)
    let cancel
    if (this.CancelToken) {
      opts.cancelToken = new this.CancelToken(function (fn) {
        cancel = fn
      })
    }
    return new Promise((resolve, reject, onCancel) => {
      if (cancel) {
        onCancel(function () {
          cancel('safely.cancelled')
        })
      }
      wrapApiQuery(this.$http.get(url, opts)).then(resolve, reject)
    })
  }
  /**
   * abstract post function that can attach common event properties.
   *
   * @param { string } url - the URL of the resource to fetch.
   * @param { Object } body - what to post to the server.
   * @return { Promise.<Object> } the eventual result of the request.
   */
  post (url, body, options = {}) {
    let opts = Object.assign({}, options)
    let cancel
    if (this.CancelToken) {
      opts.cancelToken = new this.CancelToken(function (fn) {
        cancel = fn
      })
    }
    return new Promise((resolve, reject, onCancel) => {
      if (cancel) {
        onCancel(function () {
          cancel('safely.cancelled')
        })
      }
      wrapApiQuery(this.$http.post(url, body, opts)).then(resolve, reject)
    })
  }
  /**
   * abstract options method
   */
  options (url, body) {
    let opts = {}
    let cancel
    if (this.CancelToken) {
      opts.cancelToken = new this.CancelToken(function (fn) {
        cancel = fn
      })
    }
    return new Promise((resolve, reject, onCancel) => {
      if (cancel) {
        onCancel(function () {
          cancel('safely.cancelled')
        })
      }
      wrapApiQuery(this.$http.options(url, body, opts)).then(resolve, reject)
    })
  }
  /**
   * abstract put function that can attach common event properties.
   *
   * @param { string } url - the URL of the resource to fetch.
   * @param { Object } body - what to post to the server.
   * @return { Promise.<Object> } the eventual result of the request.
   */
  put (url, body, options = {}) {
    let opts = Object.assign({}, options)
    let cancel
    if (this.CancelToken) {
      opts.cancelToken = new this.CancelToken(function (fn) {
        cancel = fn
      })
    }
    return new Promise((resolve, reject, onCancel) => {
      if (cancel) {
        onCancel(function () {
          cancel('safely.cancelled')
        })
      }
      wrapApiQuery(this.$http.put(url, body, opts)).then(resolve, reject)
    })
  }
  /**
   * abstract delete method
   */
  delete (url, body) {
    let opts = {}
    let cancel
    if (this.CancelToken) {
      opts.cancelToken = new this.CancelToken(function (fn) {
        cancel = fn
      })
    }
    return new Promise((resolve, reject, onCancel) => {
      if (cancel) {
        onCancel(function () {
          cancel('safely.cancelled')
        })
      }
      wrapApiQuery(this.$http.delete(url, body, opts)).then(resolve, reject)
    })
  }

  /** Players **/

  getAllPlayers () {
    return this.get('/players').then((data) => {
      return Promise.resolve(data)
    }).catch((error) => {
      return Promise.reject(error)
    })
  }

  getPlayerById (playerId) {
    return this.get('/players/' + playerId).then((data) => {
      return Promise.resolve(data)
    }).catch((error) => {
      return Promise.reject(error)
    })
  }

  addPlayer (query) {
    return this.post('/players', query).then((data) => {
      return Promise.resolve(data)
    }).catch((error) => {
      return Promise.reject(error)
    })
  }

  updatePlayerById (playerId, body) {
    return this.put('/players/' + playerId, body).then((data) => {
      return Promise.resolve(data)
    }).catch((error) => {
      return Promise.reject(error)
    })
  }

  deletePlayerById (playerId) {
    return this.delete('/players/' + playerId, body).then((data) => {
      return Promise.resolve(data)
    }).catch((error) => {
      return Promise.reject(error)
    })
  }

  /** Teams **/

  getAllTeams () {
    return this.get('/teams').then((data) => {
      return Promise.resolve(data)
    }).catch((error) => {
      return Promise.reject(error)
    })
  }

  getTeamById (teamId) {
    return this.get('/teams/' + teamId).then((data) => {
      return Promise.resolve(data)
    }).catch((error) => {
      return Promise.reject(error)
    })
  }

  addTeam (query) {
    return this.post('/teams', query).then((data) => {
      return Promise.resolve(data)
    }).catch((error) => {
      return Promise.reject(error)
    })
  }

  updateTeamById (teamId, body) {
    return this.put('/teams/' + teamId, body).then((data) => {
      return Promise.resolve(data)
    }).catch((error) => {
      return Promise.reject(error)
    })
  }

  deleteTeamById (teamId) {
    return this.delete('/teams/' + teamId, body).then((data) => {
      return Promise.resolve(data)
    }).catch((error) => {
      return Promise.reject(error)
    })
  }

  /** Games **/

  getAllGames () {
    return this.get('/games').then((data) => {
      return Promise.resolve(data)
    }).catch((error) => {
      return Promise.reject(error)
    })
  }

  getGameById (gameId) {
    return this.get('/games/' + gameId).then((data) => {
      return Promise.resolve(data)
    }).catch((error) => {
      return Promise.reject(error)
    })
  }

  addGame (query) {
    return this.post('/games', query).then((data) => {
      return Promise.resolve(data)
    }).catch((error) => {
      return Promise.reject(error)
    })
  }

  updateGameById (gameId, body) {
    return this.put('/games/' + gameId, body).then((data) => {
      return Promise.resolve(data)
    }).catch((error) => {
      return Promise.reject(error)
    })
  }

  deleteGameById (gameId) {
    return this.delete('/games/' + gameId, body).then((data) => {
      return Promise.resolve(data)
    }).catch((error) => {
      return Promise.reject(error)
    })
  }
}
export default TrackClient
