const INITIAL_STATE = {
  leagues: [],
  roster: [],
  invalidFields: {},
  valid: false
}

export default function teamFormReducers (state = INITIAL_STATE, action) {
  if (action.type === 'create-team.form/init') {
    state = Object.assign({}, INITIAL_STATE)
  }
  if (action.type === 'create-team.form/destroy') {
    state = Object.assign({}, INITIAL_STATE)
  }
  if (action.type === 'create-team.form/populate-options') {
    state = Object.assign({}, state)
    state[action.payload.type] = action.payload.options
  }
  if (action.type === 'create-team.form/validate') {
    state = Object.assign({}, state)
    state.invalidFields.name = !action.payload.team.name.length || !action.payload.team.name.match(/^[a-z0-9]+$/i) // TODO: error msg?
    state.invalidFields.captain = !action.payload.team.captain.length // TODO: error msg?
    state.invalidFields.leagues = !action.payload.team.leagues.length // TODO: error msg?
    state.invalidFields.roster = !action.payload.team.roster.length // TODO: error msg?

    // Form is valid when there are no filtered invalid fields
    state.valid = !Object.keys(state.invalidFields).filter(k => !!state.invalidFields[k]).length
  }
  return state

}
