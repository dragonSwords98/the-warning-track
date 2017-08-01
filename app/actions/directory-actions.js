'use strict'

import { client } from './client'
import { getMenuSelectOptions } from '@track/actions/navigation-actions'

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
      }).then((data) => {
        const state = getState()
        if (state.navigation.activeFilter === type) return dispatch(getMenuSelectOptions(state.navigation.activeItem, type))
      }).catch((error) => {
        return dispatch({ type: 'fetch-directory.teams/rejected', payload: { error: error } })
      })
    }
    if (type === 'players') {
      promise = client.getAllPlayers()
      promise.then((data) => {
        return dispatch({ type: 'fetch-directory.players/received', payload: { players: data } })
      // }).then((data) => {
      //   if (state.navigation.activeFilter === type) return dispatch(getMenuSelectOptions(state.navigation.activeItem, type))
      }).catch((error) => {
        return dispatch({ type: 'fetch-directory.players/rejected', payload: { error: error } })
      })
    }
    if (type === 'games') {
      promise = client.getAllGames()
      promise.then((data) => {
        return dispatch({ type: 'fetch-directory.games/received', payload: { games: data } })
      // }).then((data) => {
      //   if (state.navigation.activeFilter === type) return dispatch(getMenuSelectOptions(state.navigation.activeItem, type))
      }).catch((error) => {
        return dispatch({ type: 'fetch-directory.games/rejected', payload: { error: error } })
      })
    }
    if (type === 'diamonds') {
      promise = client.getAllDiamonds()
      promise.then((data) => {
        return dispatch({ type: 'fetch-directory.diamonds/received', payload: { diamonds: data } })
      // }).then((data) => {
      //   if (state.navigation.activeFilter === type) return dispatch(getMenuSelectOptions(state.navigation.activeItem, type))
      }).catch((error) => {
        return dispatch({ type: 'fetch-directory.diamonds/rejected', payload: { error: error } })
      })
    }
    if (type === 'leagues') {
      promise = client.getAllLeagues()
      promise.then((data) => {
        return dispatch({ type: 'fetch-directory.leagues/received', payload: { leagues: data } })
      }).then((data) => {
        const state = getState()
        if (state.navigation.activeFilter === type) return dispatch(getMenuSelectOptions(state.navigation.activeItem, type))
      }).catch((error) => {
        return dispatch({ type: 'fetch-directory.leagues/rejected', payload: { error: error } })
      })
    }
    return promise
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
