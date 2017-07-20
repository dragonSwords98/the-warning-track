'use strict'
import { client } from './client'
import moment from 'moment'
import { push as pushLocation } from 'react-router-redux'

import { objectToOption } from '@track/utils'

/**
 * Called when new leagues are available
 */
export function updateAvailableLeagues (availableLeagues = []) {
  return function (dispatch, getState) {
    const state = getState()
    availableLeagues = availableLeagues.length ? availableLeagues : Object.assign([], state.directory.leagues)
    dispatch({ type: 'create-game.form/populate-options', payload: { type: 'leagues', options: objectToOption(availableLeagues) } })
    dispatch(updateAvailableTeams(Object.assign([], state.directory.teams), availableLeagues))
  }
}

/**
 * Called when new teams are available or the current league has been modified
 */
export function updateAvailableTeams (availableTeams = [], availableLeagues = []) {
  return function (dispatch, getState) {
    const state = getState()
    availableLeagues = availableLeagues.length ? availableLeagues : Object.assign([], state.directory.leagues)
    availableTeams = availableTeams.length ? availableTeams : Object.assign([], state.directory.teams)
    if (state.game.league) {
      availableTeams = availableTeams.filter(t => t.leagues.includes(state.game.league._id))
    } else {
      // check if availableTeams have at least one league in leagueIds
      let leagueIds = availableLeagues.map(l => l._id)
      availableTeams = availableTeams.filter(t => t.leagues.filter(l => leagueIds.includes(l)))
    }
    dispatch({ type: 'create-game.form/populate-options', payload: { type: 'teams', options: objectToOption(availableTeams) } })
    dispatch(updateAvailableRoster(Object.assign([], state.directory.players), availableTeams))
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
      availablePlayers = availablePlayers.filter(p => p.teams.filter(l => teamIds.includes(l)))
    }
    dispatch({ type: 'create-game.form/populate-options', payload: { type: 'roster', options: objectToOption(availablePlayers) } })
    dispatch(updateAvailableBatters(availablePlayers))
  }
}

/**
 * Called when new players are available or the current roster has been modified
 */
function updateAvailableBatters (availablePlayers) {
  return function (dispatch, getState) {
    let battingList = availablePlayers.map(r => [r.name, r.gender])
    dispatch({ type: 'create-game.form/populate-options', payload: { type: 'batters', options: battingList } })
  }
}

export function createGameFormWithDefaults () {
  return function (dispatch, getState) {
    dispatch({ type: 'route.game-container/init' })
  }
}

export function updateLineups (event, data) {
  return function (dispatch, getState) {
    dispatch({ type: 'create-game.fielding-lineup/change', payload: { inning: data['data-inning'], position: data['data-position'], value: data.value } })
  }
}

export function updateGameForm (event, data) {
  return function (dispatch, getState) {
    const state = getState()
    if (data['data-create-id'] === 'league') {
      let currentLeague = state.directory.leagues.find(l => l._id === data.value)
      let isOurTeamInThisLeague = state.directory.teams.filter(t => t.leagues.includes(currentLeague)).includes(state.game.ourTeam)
      dispatch({ type: 'create-game.select-league/set', payload: { league: currentLeague, isOurTeamInThisLeague: isOurTeamInThisLeague } })
      dispatch(updateAvailableTeams(Object.assign([], state.directory.teams), [currentLeague]))
      // TODO: In order to update roster by league id, you have to pass that into updateAvailableRoster
    } else if (data['data-create-id'] === 'team') {
      dispatch({ type: 'create-game.form/update', payload: { type: 'games', field: 'ourTeam', value: data.value } })
      dispatch(updateAvailableRoster())
    } else if (data['data-create-id'] === 'diamond') {
      dispatch({ type: 'create-game.select-diamond/set', payload: { diamond: state.directory.diamonds.find(d => d._id === data.value) } })
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
    // TODO: missing battingOrder, mongo.ObjectId should never land in this app
    // CR: should have a create -> db object converter for all object about to submitted to DB or being received from DB
    let game = Object.assign({}, state.game)
    game.league = state.game.league._id
    game.dateTime = moment(state.game.dateTime).format('LLLL')
    game.homeOrAway = state.game.homeOrAway === 'Home'

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
