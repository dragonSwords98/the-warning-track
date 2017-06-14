'use strict'

import { client } from './client'

export function fetchDirectory (type) {
  return function (dispatch, getState) {
    const state = getState()
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
        return dispatch({ type: 'directory.team/new-team-success' }) // move new team to team directory, clear the team form
      }).catch((error) => {
        return dispatch({ type: 'directory.team/new-team-rejected', payload: { error: error } })
      })
    }
    if (id === 'createPlayerForm') {
      promise = client.addPlayer(state.directory.createPlayer)
      promise.then((data) => {
        return dispatch({ type: 'directory.player/new-player-success' }) // move new player to player directory, clear the player form
      }).catch((error) => {
        return dispatch({ type: 'directory.player/new-player-rejected', payload: { error: error } })
      })
    }
    // if (id === 'createGameForm') {

    // }

    return promise
  }

}
