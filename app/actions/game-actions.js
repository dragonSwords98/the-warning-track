'use strict'
import { client } from './client'
import { fetchDirectory } from '@track/actions/directory-actions' // CR: looks like it don't belong as a 'directory' state

const populateGameDetails = function (game, state) {
  const { teams, players, games, leagues, diamonds } = state.directory
  // game.league = leagues.find(l => l._id === game.league) // TODO: rules now sit in league
  // game.diamond = diamonds.find(d => d._id === game.diamond)
  // game.ourTeam = teams.find(t => t._id === game.ourTeam)
  // game.ourBattingOrder = game.ourBattingOrder.map(batter => {
  //   return players.find(p => p._id === batter)
  // })

  // TODO: handle fielding lineups that differ per inning
  // game.ourFieldingLineup = game.ourFieldingLineup.map(fielder => {
  //   console.log('ourFieldingLineup', fielder)
  //   return players.find(p => p._id === fielder)
  // })
  return game
}

export function loadGame () {
  return function (dispatch, getState) {
    const state = getState()
    let promise = client.getGameById()
    promise.then((data) => {
      let game = Object.assign({}, data.game)
      dispatch({
        type: 'route.game-container/load-game.success',
        payload: {
          // game: populateGameDetails(game, state)
          game
        }
      })
    }).catch((error) => {
      dispatch({
        type: 'route.game-container/load-game.rejected',
        payload: {
          error: error
        }
      })
    })
  }
}

export function startGame (gameId) {
  return function (dispatch, getState) {
    const state = getState()
    if (state.directory.games) {
      let game = Object.assign({}, state.directory.games.find(g => g._id === gameId))
      //TODO: change both directory and game instance
      dispatch({
        type: 'route.game-container/start-game.initialize',
        payload: {
          // game: populateGameDetails(game, state)
          game
        }
      })
    }
  }
}

export function updateLineups (event, data) {
  return function (dispatch, getState) {
    const state = getState()
    console.log('updateLineups', event, data)
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
      // dispatch({ type: 'create-game.select-team/set', payload: { team: data.value, roster: state.directory.players.filter(p => p.teams.contains(data.value)) } })
      dispatch({ type: 'create-game.form/update', payload: { type: 'games', field: 'ourTeam', value: data.value } })
    } else if (data['data-create-id'] === 'diamond') {
      dispatch({ type: 'create-game.select-diamond/set', payload: { league: state.directory.diamonds.find(d => d._id === data.value)} })
    } else if (data['data-create-id'] === 'homeOrAway') {
      dispatch({ type: 'create-game.home-or-away/set', payload: { isHome: data.checked } })
    } else  {
      dispatch({ type: 'create-game.form/update', payload: { type: 'games', field: data['data-create-id'], value: data.value } })
    }
  }
}
