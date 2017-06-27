'use strict'
import { client } from './client'

export function fetchTeam (id) {
  return function (dispatch, getState) {
    const state = getState()
    if (state.directory.teams) {
      let team = state.directory.teams.filter(t => t._id === id)
      if (team) {
        return dispatch({ type: 'route.team-container/init', payload: team })
      }
    }
    let promise = client.getTeamById(id)
    return promise.then((data) => {
      return dispatch({ type: 'route.team-container/init', payload: { team: data } })
    }).catch((error) => {
      return dispatch({ type: 'route.team-container/no-such-team', payload: error })
    })
  }
}