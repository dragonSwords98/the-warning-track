'use strict'

const INITIAL_STATE = {
  leagues: [],
  teams: [],
  diamonds: [],
  roster: [],
  active: [],
  reserve: [],
  batters: [],
  reserveBatters: [],
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
    if (action.payload.type === 'roster') {
      state.active = action.payload.options
    }
  }
  if (action.type === 'create-game.form/evaluate-active-roster') {
    // roster, active, reserve
    state = Object.assign({}, state)
    state.active = state.roster.filter(r => action.payload.selectedPlayers.includes(r.value)) // continues latest active roster
    state.reserve = state.roster.filter(r => !state.active.includes(r))

    // batters
    let allBatters = state.batters.concat(state.reserveBatters)
    state.batters = []
    state.reserveBatters = []

    allBatters.forEach(b => {
      if (state.active.map(a => a.value).includes(b[3])) {
        state.batters.push(b)
      } else {
        state.reserveBatters.push(b)
      }
    })
    // CR: better to sort by league's Coed Rule, if applicable
    state.batters.sort((a, b) => a[1] > b[1] ? -1 : 1)
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
