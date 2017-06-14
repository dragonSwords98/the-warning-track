'use strict'

const INITIAL_STATE = {
  name: '',
  
  teams: [],
}

export default function playerReducers(state = INITIAL_STATE, action) {
  if (action.type === 'route.player-container/init') {
    state = Object.assign({}, state, INITIAL_STATE)
    return state
  }
  if (action.type === 'route.player-container/destroy') {
    state = Object.assign({}, state)
    state = null
    return state
  }

  if (action.type === 'fetch-player/received') {
    state = Object.assign({}, state)
    state.name = action.payload.player.name
    state.jersey = action.payload.player.jersey
    return state
  }
  return state
}