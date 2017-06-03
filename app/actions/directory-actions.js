'use strict'

import { client } from './client'

export function fetchDirectory(type) {
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
    return promise
  }
}
