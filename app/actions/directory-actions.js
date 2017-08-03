'use strict'

import { client } from './client'
import { updateMenuFilter } from '@track/actions/navigation-actions'

export function fetchAll () {
  return function (dispatch, getState) {
    let promise

    promise = client.getAllLeagues()
    promise.then((data) => {
      dispatch({ type: 'fetch-directory.leagues/received', payload: { leagues: data } })
      return client.getAllTeams()
    }).then((data) => {

      dispatch({ type: 'fetch-directory.teams/received', payload: { teams: data } })
      return client.getAllPlayers()
    }).then((data) => {

      dispatch({ type: 'fetch-directory.players/received', payload: { players: data } })
      return client.getAllGames()
    }).then((data) => {
      dispatch({ type: 'fetch-directory.games/received', payload: { games: data } })
      return client.getAllDiamonds()
    }).then((data) => {
      dispatch({ type: 'fetch-directory.diamonds/received', payload: { diamonds: data } })
      return
    }).then(() => {
      dispatch(updateMenuFilter())
    })
  }
}

export function updateCreateForm (type, event, data) {
  return function (dispatch, getState) {
    let field, value
    if (!data) {
      value = event
      field = 'jersey'
    } else if (!data.value) {
      // GENDER
      value = data.checked ? 1 : 0
      field = data['data-create-id']
    } else {
      value = data.value
      field = data['data-create-id']
    }

    if (type === 'teams') {
      dispatch({ type: 'directory.create-team/update', payload: { field: field, value: value } })
    }
    if (type === 'players') {
      dispatch({ type: 'directory.create-player/update', payload: { field: field, value: value } })
    }
  }
}

export function submitCreateForm (id) {
  return function (dispatch, getState) {
    const state = getState()
    let promise

    if (id === 'createTeamForm') {
      promise = client.addTeam(state.team)
      promise.then((data) => {
        return dispatch({
          type: 'directory.create-team/success',
          payload: {
            _id: data._id,
            newTeam: state.team
          }
        }) // move new team to team directory, clear the team form
      }).catch((error) => {
        return dispatch({
          type: 'directory.create-team/rejected',
          payload: { error: error }
        })
      })
    }
    if (id === 'createPlayerForm') {
      promise = client.addPlayer(state.player)
      promise.then((data) => {
        return dispatch({
          type: 'directory.create-player/success',
          payload: {
            _id: data._id,
            newPlayer: state.player
          }
        }) // move new player to player directory, clear the player form
      }).catch((error) => {
        return dispatch({
          type: 'directory.create-player/rejected',
          payload: { error: error }
        })
      })
    }

    return promise
  }
}
