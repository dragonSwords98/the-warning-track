'use strict'

const INITIAL_STATE = {
  leagues: [],
  teams: [],
  diamonds: [],
  roster: [],
  batters: [],
  invalidFields: {},
  valid: false
}

export default function createGameReducers (state = INITIAL_STATE, action) {
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
  if (action.type === 'create-game.form/validate') {
    state = Object.assign({}, state)
    state.invalidFields = action.payload.invalidFields
    // TODO: validate game form
    // Form is valid when there are no filtered invalid fields
    state.valid = !Object.keys(state.invalidFields).filter(k => !!state.invalidFields[k]).length
  }
  return state
}
