'use strict'
import { client } from './client'

const populateTeamsAndPlayers = function (state, data) {
  data.ourBattingOrder = data.ourBattingOrder.map(batter => {
    return state.directory.players.find(p => p._id === batter)
  })
  data.ourFieldingLineup = data.ourFieldingLineup.map(fielder => {
    return state.directory.players.find(p => p._id === fielder)
  })
  data.ourTeam = state.directory.teams.find(t => t._id === data.ourTeam)
  console.log('populateTeamsAndPlayers', data)
  return data
}

export function loadGame (gameId) {
  return function (dispatch, getState) {
    let promise = client.getGameById(gameId)
    return promise.then((data) => {
      const state = getState() 
      dispatch({
        type: 'route.game-container/load-game.success',
        payload: {
          game: populateTeamsAndPlayers(state, data)
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

// export function startGame (gameId) {
//   return function (dispatch, getState) {
//     const state = getState()
//     if (state.directory.games) {
//       let game = Object.assign({}, state.directory.games.find(g => g._id === gameId))
//       // TODO: change both directory and game instance
//       dispatch({
//         type: 'route.game-container/start-game.initialize',
//         payload: {
//           game
//         }
//       })
//     }
//   }
// }

export function updateLineups (event, data) {
  return function (dispatch, getState) {
    const state = getState()
    dispatch({ type: 'create-game.fielding-lineup/change', payload: { cellId: data['data-id'], value: data.value }})
  }
}

export function updateGameForm (event, data) {
  return function (dispatch, getState) {
    const state = getState()
    if (data['data-create-id'] === 'league') {
      let currentLeague = state.directory.leagues.find(l => l._id === data.value)
      let isOurTeamInThisLeague = state.directory.teams.filter(t => t.leagues.includes(currentLeague)).includes(state.game.ourTeam)
      dispatch({ type: 'create-game.select-league/set', payload: { league: currentLeague, isOurTeamInThisLeague: isOurTeamInThisLeague } })
    } else if (data['data-create-id'] === 'team') {
      dispatch({ type: 'create-game.form/update', payload: { type: 'games', field: 'ourTeam', value: data.value } })
    } else if (data['data-create-id'] === 'diamond') {
      dispatch({ type: 'create-game.select-diamond/set', payload: { league: state.directory.diamonds.find(d => d._id === data.value) } })
    } else if (data['data-create-id'] === 'homeOrAway') {
      dispatch({ type: 'create-game.home-or-away/set', payload: { isHome: data.checked } })
    } else {
      dispatch({ type: 'create-game.form/update', payload: { type: 'games', field: data['data-create-id'], value: data.value } })
    }
  }
}

export function submitGameForm (event, data) {
  return function (dispatch, getState) {
    const state = getState()
    let promise = client.addGame(state.game)
    return promise.then((data) => {
      const state = getState() 
      dispatch({
        type: 'route.game-container/create-game.success',
        payload: {
          _id: data._id,
          newGame: state.game
        }
      })
    }).catch((error) => {
      return dispatch({
        type: 'route.game-container/create-game.rejected',
        payload: {
          error: error
        }
      })
    })
  }
}

