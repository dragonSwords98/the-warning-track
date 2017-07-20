'use strict'

const INITIAL_STATE = {
  leagues: [],
  teams: [],
  diamonds: [],
  roster: [],
  batters: []
}

export default function formReducers (state = INITIAL_STATE, action) {
  if (action.type === 'create-game.form/init') {
    state = Object.assign({}, INITIAL_STATE)
  }
  if (action.type === 'create-game.form/destroy') {
    state = Object.assign({}, INITIAL_STATE)
  }
  if (action.type === 'create-game.form/populate-options') {
    state = Object.assign({}, state)
    state[action.payload.type] = action.payload.options
  }
  return state
}
