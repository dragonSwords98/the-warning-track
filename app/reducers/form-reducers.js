'use strict'

const INITIAL_STATE = {
  leagues: [],
  teams: [],
  diamonds: [],
  roster: [],
  batters: [],
  invalidGameFields: {},
  invalidPlayerFields: {},
  invalidTeamFields: {}
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
  if (action.type === 'create-team.form/validate') {
    state = Object.assign({}, state)
    state.invalidTeamFields.name = !action.payload.team.name.length || !action.payload.team.name.match(/^[a-z0-9]+$/i) // TODO: error msg?
    state.invalidTeamFields.captain = !action.payload.team.captain.length // TODO: error msg?
    state.invalidTeamFields.leagues = !action.payload.team.leagues.length // TODO: error msg?
    state.invalidTeamFields.roster = !action.payload.team.roster.length // TODO: error msg?

    if (!state.invalidTeamFields.name || !state.invalidTeamFields.captain || !state.invalidTeamFields.leagues || !state.invalidTeamFields.roster) {
      state.invalidTeamFields.valid = false
    }
    console.log(action.payload, state)
  }
  return state
}
