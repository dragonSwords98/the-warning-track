'use strict'
import { fetchDirectory } from '@track/actions/directory-actions' // CR: looks like it don't belong as a 'directory' state

export function loadGame () {
  return function (dispatch, getState) {
    const state = getState()

    // TODO: prompt api for game id
    let gameId = 0
    let homeId = 0

    dispatch({ type: 'route.game-container/load-game', payload: {
      gameId: gameId++,
      homeId: homeId
    }})

  }
}

export function startGame () {
  return function (dispatch, getState) {

    // TODO: prompt api for game id
    let gameId = 0
    let homeId = 0

    let promise = dispatch(fetchDirectory('players'))

    promise.then(() => {
      const state = getState()
      dispatch({
        type: 'route.game-container/start-game',
        payload: {
          gameId: gameId++,
          homeId: homeId,
          battingOrder: state.directory.players
        }
      })
    }).catch((error) => {
      dispatch({
        type: 'route.game-container/start-game.error',
        payload: {
          error
        }
      })
    })

  }
}

export function setLeague (leagueName) {
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
    dispatch({ type: 'create-game.select-league/set' }) // this should set the rules and modify columns and rows

    // TODO: prompt api for league rules
    let rules = {
      leagueId: 'CCSA',
      innings: 8,
      positions: [
        'C', '1B', '2B', 'SS', '3B', 'LF', 'LR', 'CF', 'RR', 'RF'
      ],
      homeRunRule: false,
      mercyRuns: 5,
      noMercyInningBegin: 7,
      coedRule: 'MMMF'
    }

    dispatch({ type: 'create-game.get-league-rules/received', payload: rules })
  }
}