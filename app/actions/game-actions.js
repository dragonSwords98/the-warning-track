'use strict'
import { client } from './client'

const loadGameObject = function (state, game) {
  game.ourBattingOrder = game.ourBattingOrder.map(batter => {
    return state.directory.players.find(p => p._id === batter)
  })
  game.ourFieldingLineup = game.ourFieldingLineup.map(inning => {
    let map = Object.keys(inning).map(k => {
      return state.directory.players.find(p => p._id === inning[k])
    })
    return map
  })
  game.ourTeam = state.directory.teams.find(t => t._id === game.ourTeam)
  game.homeOrAway = game.homeOrAway ? 'Home' : 'Away'
  return game
}

export function loadGame (gameId) {
  return function (dispatch, getState) {
    let promise = client.getGameById(gameId)
    return promise.then((data) => {
      const state = getState()
      dispatch({
        type: 'route.game-container/load-game.success',
        payload: {
          game: loadGameObject(state, data)
        }
      })
      return client.getLeagueById(data.league)
    }).then((data) => {
      return dispatch({
        type: 'route.game-container/load-league.success',
        payload: {
          league: data
        }
      })
    }).catch((error) => {
      return dispatch({
        type: 'route.game-container/load-game.rejected',
        payload: {
          error: error
        }
      })
    })
  }
}

export function saveGame () {
  return function (dispatch, getState) {
    const state = getState()
    let promise = client.updateGame(state.game)
    return promise.then((data) => {
      return dispatch({ type: 'game.save/success' })
    }).catch((error) => {
      return dispatch({ type: 'game.save/error', payload: error })
    })
  }
}
