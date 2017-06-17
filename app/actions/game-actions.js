'use strict'
import { client } from './client'
import { fetchDirectory } from '@track/actions/directory-actions' // CR: looks like it don't belong as a 'directory' state

const populateGameDetails = function (game, state) {
  const { teams, players, games, leagues, diamonds } = state.directory
  game.league = leagues.find(l => l._id === game.league) // TODO: rules now sit in league
  game.diamond = diamonds.find(d => d._id === game.diamond)
  game.ourTeam = teams.find(t => t._id === game.ourTeam)
  game.ourBattingOrder = game.ourBattingOrder.map(batter => {
    return players.find(p => p._id === batter)
  })

  // TODO: handle fielding lineups that differ per inning
  game.ourFieldingLineup = game.ourFieldingLineup.map(fielder => {
    console.log('ourFieldingLineup', fielder)
    return players.find(p => p._id === fielder)
  })
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
          game: populateGameDetails(game, state)
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
          game: populateGameDetails(game, state)
        }
      })
    }
  }
}

export function setLeague (leagueId) {
  return function (dispatch, getState) {
    const state = getState()

    // const ONE_ROVER_POSITIONS = [ 'C', '1B', '2B', 'SS', '3B', 'LF', 'LR', 'CF', 'RF' ] // NATIONSLEAGUE
    // const ONE_ROVER_PITCHER_POSITIONS = [ 'P', 'C', '1B', '2B', 'SS', '3B', 'LF', 'LR', 'CF', 'RF' ] // SSSL
    // const TWO_ROVER_POSITIONS = [ 'C', '1B', '2B', 'SS', '3B', 'LF', 'LR', 'CF', 'RR', 'RF' ] // FORMOSAN, CCSA
    // const TWO_ROVER_PITCHER_POSITIONS = [ 'P', 'C', '1B', '2B', 'SS', '3B', 'LF', 'LR', 'CF', 'RR', 'RF' ] // SNSB

    // let SIX_INNINGS = 6
    // let SEVEN_INNINGS = 7
    // let EIGHT_INNINGS = 8
    // let NINE_INNINGS = 9
    dispatch({ type: 'create-game.select-league/set', payload: { league: state.directory.leagues.find(l => l._id === leagueId)} })
    // this should set the rules and modify columns and rows

    // TODO: prompt api for league rules
    // let rules = {
    //   leagueId: 'CCSA',
    //   innings: 8,
    //   positions: [
    //     'C', '1B', '2B', 'SS', '3B', 'LF', 'LR', 'CF', 'RR', 'RF'
    //   ],
    //   homeRunRule: false,
    //   mercyRuns: 5,
    //   noMercyInningBegin: 7,
    //   coedRule: 'MMMF'
    // }

    // dispatch({ type: 'create-game.get-league-rules/received', payload: rules })
  }
}
