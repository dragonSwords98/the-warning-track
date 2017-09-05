'use strict'

const INITIAL_STATE = {
  leagues: [],
  teams: [],
  diamonds: [],
  roster: [],
  batters: [],
  promptClear: false,
  invalidFields: {},
  valid: false,
  count: []
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
  if (action.type === 'create-game.fielder-all/open-clear-prompt') {
    state = Object.assign({}, state)
    state.promptClear = true
  }
  if (action.type === 'create-game.fielder-all/close-clear-prompt') {
    state = Object.assign({}, state)
    state.promptClear = false
  }
  if (action.type === 'create-game.form/validate') {
    state = Object.assign({}, state)
    state.invalidFields = action.payload.invalidFields
    // TODO: validate game form
    // Form is valid when there are no filtered invalid fields
    state.valid = !Object.keys(state.invalidFields).filter(k => !!state.invalidFields[k]).length
  }
  // if (action.type === 'create-game.fielding-lineup/change') {
  // if (action.type === 'create-game.fielder-row/clear') {
  // if (action.type === 'create-game.fielder-inning/clear') {
  // if (action.type === 'create-game.fielder-all/clear') {
  // if (action.type === 'create-game.fielder-all/fill') {
  if (action.type === 'create-game.fielder-count/update') {
    state = Object.assign({}, state)
    state.count = action.payload.count
  }
  if (action.type === 'create-game.fielder-count/clear') {
    state = Object.assign({}, state)
    state.count = []
  }

  return state
}
