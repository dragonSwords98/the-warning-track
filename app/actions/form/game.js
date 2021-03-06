'use strict'
import { client } from '../client'
import moment from 'moment'
import { push as pushLocation } from 'react-router-redux'

import { objectToOption, populateScoresheet, populateGrid, countFielders, firstUniqueFindFirstApply, validateBattingOrder } from '@track/utils'
import { BENCH_STATUS, SINGLE_HIT, MINIMAL_BATTERS_COUNT, GENERIC_ATBAT } from '@track/utils/constants'

/**
 * Called when new diamonds are available
 */
export function updateAvailableDiamonds () {
  return function (dispatch, getState) {
    const state = getState()
    let availableDiamonds = Object.assign([], state.directory.diamonds)
    dispatch({ type: 'create-game.form/populate-options', payload: { type: 'diamonds', options: objectToOption(availableDiamonds) } })
  }
}

/**
 * Called when new leagues are available
 */
export function updateAvailableLeagues (availableLeagues = [], chain = false) {
  return function (dispatch, getState) {
    const state = getState()
    availableLeagues = availableLeagues.length ? availableLeagues : Object.assign([], state.directory.leagues)
    dispatch({ type: 'create-game.form/populate-options', payload: { type: 'leagues', options: objectToOption(availableLeagues) } })
  }
}

/**
 * Called when new teams are available or the current league has been modified
 */
export function updateAvailableTeams (availableTeams = [], availableLeagues = [], chain = false) {
  return function (dispatch, getState) {
    const state = getState()
    availableLeagues = availableLeagues.length ? availableLeagues : Object.assign([], state.directory.leagues)
    availableTeams = availableTeams.length ? availableTeams : Object.assign([], state.directory.teams)
    let leagueIds = []
    if (state.game.league) {
      // Use this state.game.league._id to find available teams
      availableTeams = availableTeams.filter(t => t.leagues.findIndex(l => l._id ? state.game.league._id === l._id : state.game.league._id === l) > -1)
    }
    dispatch({ type: 'create-game.form/populate-options', payload: { type: 'teams', options: objectToOption(availableTeams) } })
  }
}

/**
 * Called when new players are available or the current league / current team has been modified
 */
export function updateAvailableRoster (availablePlayers = [], availableTeams = []) {
  return function (dispatch, getState) {
    const state = getState()
    // availableLeagues = availableLeagues.length ? availableLeagues : Object.assign([], state.directory.leagues)
    availableTeams = availableTeams.length ? availableTeams : Object.assign([], state.directory.teams)
    availablePlayers = availablePlayers.length ? availablePlayers : Object.assign([], state.directory.players)
    if (state.game.ourTeam) {
      availablePlayers = availablePlayers.filter(p => p.teams.includes(state.game.ourTeam))
    } else {
      // check if availablePlayers have at least one team in teamIds
      let teamIds = availableTeams.map(t => t._id)
      availablePlayers = availablePlayers.filter(p => p.teams.findIndex(l => teamIds.includes(l)) > 0)
    }
    dispatch({ type: 'create-game.form/populate-options', payload: { type: 'roster', options: objectToOption(availablePlayers, true) } })
    dispatch(updateAvailableBatters(availablePlayers))
  }
}

/**
 * Called when new players are available or the current roster has been modified
 */
function updateAvailableBatters (availablePlayers) {
  return function (dispatch, getState) {
    let battingList = availablePlayers.map(r => [r.name, r.gender, r.jersey, r._id])
    dispatch({ type: 'create-game.form/populate-options', payload: { type: 'batters', options: battingList } })
  }
}

export function createGameFormWithDefaults () {
  return function (dispatch, getState) {
    const state = getState()
    dispatch({ type: 'route.game-container/init' })
    if (!state.createGame.leagues.length) {
      dispatch(updateAvailableLeagues())
    }
    if (!state.createGame.teams.length) {
      dispatch(updateAvailableTeams())
    }
    if (!state.createGame.roster.length) {
      dispatch(updateAvailableRoster())
    }
  }
}

export function autoFillFieldingLineup () {
  return function (dispatch, getState) {
    const state = getState()
    let fieldingLineup = Object.assign([], state.game.ourFieldingLineup)
    const active = state.createGame.active

    // 1. Get roster positions
    // CR: Should never map backwards... from option back to object is taboo...
    let availableFielders = active.map(r => {
      let player = state.directory.players.find(p => p._id === r.key)
      return Object.assign({}, r, { positions: player.positions })
    })

    // 2. Apply algorithm
    // Default: Greedy first unique find first apply, otherwise empty
    fieldingLineup = firstUniqueFindFirstApply(availableFielders, Object.assign([], fieldingLineup))

    dispatch({ type: 'create-game.fielder-all/fill', payload: { fieldingLineup: fieldingLineup } })
    dispatch({ type: 'create-game.fielder-count/update', payload: { count: countFielders(active, fieldingLineup) }})
    dispatch(validateGameForm())
  }
}

export function clearFielderRow (data) {
  return function (dispatch, getState) {
    const state = getState()
    dispatch({ type: 'create-game.fielder-row/clear', payload: { position: data.data } })
    dispatch({ type: 'create-game.fielder-count/update', payload: { count: countFielders(state.createGame.active, state.game.ourFieldingLineup) }})
    dispatch(validateGameForm())
  }
}

export function clearFielderInning (data) {
  return function (dispatch, getState) {
    const state = getState()
    dispatch({ type: 'create-game.fielder-inning/clear', payload: { inning: data.data } })
    dispatch({ type: 'create-game.fielder-count/update', payload: { count: countFielders(state.createGame.active, state.game.ourFieldingLineup) }})
    dispatch(validateGameForm())
  }
}


export function clearFieldingLineup () {
  return function (dispatch, getState) {
    dispatch({ type: 'create-game.fielder-all/clear' })
    dispatch({ type: 'create-game.fielder-all/close-clear-prompt' })
    dispatch({ type: 'create-game.fielder-count/clear' })
    dispatch(validateGameForm())
  }
}

export function updateLineups (event, data) {
  return function (dispatch, getState) {
    const state = getState()
    dispatch({ type: 'create-game.fielding-lineup/change', payload: { inning: data['data-inning'], position: data['data-position'], value: data.value } })
    dispatch({ type: 'create-game.fielder-count/update', payload: { count: countFielders(state.createGame.active, state.game.ourFieldingLineup) }})
    // CR: Validating all the time?
    return dispatch(validateGameForm())
  }
}

export function updateBattingOrder (newOrder) {
  return function (dispatch, getState) {
    dispatch({ type: 'create-game.batting-order/change', payload: { newOrder: newOrder } })
    return dispatch(validateGameForm())
  }
}

export function updateGameForm (event, data) {
  return function (dispatch, getState) {
    const state = getState()
    if (data['data-create-id'] === 'league') {
      let currentLeague = state.directory.leagues.find(l => l._id === data.value)
      let isOurTeamInThisLeague = state.directory.teams.filter(t => t.leagues.includes(currentLeague)).includes(state.game.ourTeam)
      dispatch({ type: 'create-game.select-league/set', payload: { league: currentLeague, isOurTeamInThisLeague: isOurTeamInThisLeague } })
      dispatch(updateAvailableTeams(Object.assign([], state.directory.teams), [currentLeague], true))
      // TODO: In order to update roster by league id, you have to pass that into updateAvailableRoster
      // TODO: Should prompt user before changing the league for a second time because they will lose their work!
    } else if (data['data-create-id'] === 'team') {
      dispatch({ type: 'create-game.form/update', payload: { type: 'games', field: 'ourTeam', value: data.value } })
      dispatch(updateAvailableRoster())
    } else if (data['data-create-id'] === 'diamond') {
      dispatch({ type: 'create-game.select-diamond/set', payload: { diamond: state.directory.diamonds.find(d => d._id === data.value) } })
    } else if (data['data-create-id'] === 'homeOrAway') {
      dispatch({ type: 'create-game.home-or-away/set', payload: { isHome: data.checked } })
    } else if (data['data-create-id'] === 'ourActiveRoster') {
      // 1. Update Active/Reserve Rosters, 2. Update Active/Reserve Batters, 3. Cleanup ourFieldingLineup
      dispatch({ type: 'create-game.form/evaluate-active-roster', payload: { selectedPlayers: data.value } })
    } else {
      console.warn('please investigate what this case covers')
      dispatch({ type: 'create-game.form/update', payload: { type: 'games', field: data['data-create-id'], value: data.value } })
    }

    // CR: Validating all the time?
    return dispatch(validateGameForm())
  }
}

const saveNewGameObject = function (state, game) {
  game.league = state.game.league._id
  game.dateTime = moment(state.game.dateTime).format('LLLL')
  game.homeOrAway = state.game.homeOrAway === 'Away' ? 0 : 1

  // Don't save these
  game.lockedInnings = undefined

  // CR: converting the batting order back to ids here may not be ideal, maybe should be in reducer while the batting order is created/updated
  // Another issue is finding by batter's name is not ideal, susceptible to duplicate name errors
  game.ourBattingOrder = game.ourBattingOrder.map(batter => state.directory.players.find(p => p.name === batter[0])._id)
  game.statusGrid = populateGrid(state.game.league.innings, state.game.ourBattingOrder.length, Object.assign({}, BENCH_STATUS))
  game.hitGrid = populateGrid(state.game.league.innings, state.game.ourBattingOrder.length, Object.assign({}, SINGLE_HIT))
  game.scoresheet = {
    ours: populateScoresheet(state.game.league.innings),
    theirs: populateScoresheet(state.game.league.innings)
  }
  game.opponentBattingReport = new Array(MINIMAL_BATTERS_COUNT).fill().map((o, i) => {
    return {
      name: 'Anonymous Chan',
      number: i++,
      atBats: new Array(state.game.league.innings).fill().map(b => Object.assign({}, GENERIC_ATBAT))
    }
  })
  return game
}

const validateGameForm = function () {
  return function (dispatch, getState) {
    const game = getState().game

    // Standard form validation
    let invalidFields = {}
    invalidFields.league = !game.league
    invalidFields.ourTeam = !game.ourTeam
    invalidFields.opposingTeam = !game.opposingTeam.length
    invalidFields.diamond = !game.diamond
    if (game.ourFieldingLineup.length) {
      invalidFields.ourFieldingLineupIsEmpty = !game.ourFieldingLineup.reduce((p, o) => {
        return p + Object.keys(o).reduce(function (previous, key) {
            return previous + o[key];
        }, '')
      }, '').length

      invalidFields.ourFieldingLineupIsNotFull = game.ourFieldingLineup.find(inning => {
        return Object.values(inning).findIndex(v => !v) > -1
      })
    }
    
    invalidFields.dateTime = !game.dateTime

    // Additional validations
    // 1. Validate league rules that there are legal number of players.
    // Assumption all players that field must bat! So if not even to bat, then not enough to field
    let legalMinimalRoster = game.league ? game.league.minimalRoster : MINIMAL_BATTERS_COUNT
    invalidFields.illegalMinimalRoster = game.ourBattingOrder.length < legalMinimalRoster

    // 2. Validate league rules that team batting order is arranged guy-guy-girl or guy-guy-guy-girl, etc.
    let coedRule = game.league ? game.league.coedRule : null
    if (coedRule) {
      invalidFields.illegalBattingOrder = validateBattingOrder(game.ourBattingOrder, coedRule)
    }

    // TODO: Validate the roster is legal (no repeated players, etc. depending on how strict you wanna be)
    // 3. Validate no duplicates of same player playing 2 pos in same inning
    // 4. Validate opponent's details (to be added)

    return dispatch({ type: 'create-game.form/validate', payload: { invalidFields } })
  }
}

export function submitGameForm (event, data) {
  return function (dispatch, getState) {
    const state = getState()
    let game = saveNewGameObject(state, Object.assign({}, state.game))
    let promise = client.addGame(game)
    return promise.then((data) => {
      const state = getState()
      dispatch({
        type: 'route.game-container/create-game.success',
        payload: {
          _id: data._id,
          newGame: state.game
        }
      })
      dispatch(pushLocation('/games'))
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
