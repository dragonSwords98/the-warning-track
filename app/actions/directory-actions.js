'use strict'

import { client } from './client'

/**
 * Fetch directories by type. For directory pages AND for initial populating of web app data
 */
export function fetchDirectory (type) {
  return function (dispatch, getState) {
    let promise
    if (type === 'teams') {
      promise = client.getAllTeams()
      promise.then((data) => {
        return dispatch({ type: 'fetch-directory.teams/received', payload: { teams: data } })
      }).catch((error) => {
        return dispatch({ type: 'fetch-directory.teams/rejected', payload: { error: error } })
      })
    }
    if (type === 'players') {
      promise = client.getAllPlayers()
      promise.then((data) => {
        return dispatch({ type: 'fetch-directory.players/received', payload: { players: data } })
      }).catch((error) => {
        return dispatch({ type: 'fetch-directory.players/rejected', payload: { error: error } })
      })
    }
    if (type === 'games') {
      promise = client.getAllGames()
      promise.then((data) => {
        return dispatch({ type: 'fetch-directory.games/received', payload: { games: data } })
      }).catch((error) => {
        return dispatch({ type: 'fetch-directory.games/rejected', payload: { error: error } })
      })
    }
    if (type === 'diamonds') {
      promise = client.getAllDiamonds()
      promise.then((data) => {
        return dispatch({ type: 'fetch-directory.diamonds/received', payload: { diamonds: data } })
      }).catch((error) => {
        return dispatch({ type: 'fetch-directory.diamonds/rejected', payload: { error: error } })
      })
    }
    if (type === 'leagues') {
      promise = client.getAllLeagues()
      promise.then((data) => {
        return dispatch({ type: 'fetch-directory.leagues/received', payload: { leagues: data } })
      }).catch((error) => {
        return dispatch({ type: 'fetch-directory.leagues/rejected', payload: { error: error } })
      })
    }
    return promise
  }
}

export function submitCreateForm (id) {
  return function (dispatch, getState) {
    const state = getState()
    let promise

    if (id === 'createTeamForm') {
      promise = client.addTeam(state.directory.createTeam)
      promise.then((data) => {
        return dispatch({
          type: 'directory.team/new-team-success',
          payload: {
            _id: data._id,
            newTeam: state.directory.createTeam
          }
        }) // move new team to team directory, clear the team form
      }).catch((error) => {
        return dispatch({
          type: 'directory.team/new-team-rejected',
          payload: { error: error }
        })
      })
    }
    if (id === 'createPlayerForm') {
      promise = client.addPlayer(state.directory.createPlayer)
      promise.then((data) => {
        return dispatch({
          type: 'directory.player/new-player-success',
          payload: {
            _id: data._id,
            newPlayer: state.directory.createPlayer
          }
        }) // move new player to player directory, clear the player form
      }).catch((error) => {
        return dispatch({
          type: 'directory.player/new-player-rejected',
          payload: { error: error }
        })
      })
    }

    return promise
  }
}
