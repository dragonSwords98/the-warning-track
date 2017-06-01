'use strict'

const INITIAL_STATE = {
  teams: null,
  players: null
}

export default function directoryReducers(state = INITIAL_STATE, action) {
  if (action.type === 'route.directory-list/init') {
    state = Object.assign({}, state, INITIAL_STATE)
    return state
  }
  if (action.type === 'route.directory-list/destroy') {
    state = Object.assign({}, state)
    state.teams = null
    state.players = null
    return state
  }

  if (action.type === 'fetch-directory.teams/received') {
    state = Object.assign({}, state)
    state.teams = action.payload.directory
    return state
  }

  if (action.type === 'fetch-directory.players/received') {
    state = Object.assign({}, state)
    state.players = action.payload.directory
    return state
  }
  return state
}
