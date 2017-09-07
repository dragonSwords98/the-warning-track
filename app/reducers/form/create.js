const INITIAL_STATE = {
  invalidFields: {},
  valid: false,
  submitted: false
}

export default function createReducers (state = INITIAL_STATE, action) {
  if (action.type === 'create-form/init') {
    state = Object.assign({}, INITIAL_STATE)
  }
  if (action.type === 'create-form/destroy') {
    state = Object.assign({}, INITIAL_STATE)
  }
  if (action.type === 'create-form.player/validate') {
    state = Object.assign({}, state)
    state.invalidFields.name =  !action.payload.player.name.length || !action.payload.player.name.match(/^[a-z]{2,30}[ ]?[a-z]{1,30}$/i) // TODO: error msg? multiple occurrences of a-z

    // Form is valid when there are no filtered invalid fields
    state.valid = !Object.keys(state.invalidFields).filter(k => !!state.invalidFields[k]).length
  }
  if (action.type === 'create-form.team/validate') {
    state = Object.assign({}, state)

    // CR: Invalid comparison should be done in actions not reducers
    state.invalidFields.name = !action.payload.team.name.length || !action.payload.team.name.match(/^[a-z ]{2,30}$/i) // TODO: error msg?
    state.invalidFields.captain = !action.payload.team.captain.length // TODO: error msg?
    state.invalidFields.leagues = !action.payload.team.leagues.length // TODO: error msg?
    state.invalidFields.roster = !action.payload.team.roster.length // TODO: error msg?

    // Form is valid when there are no filtered invalid fields
    state.valid = !Object.keys(state.invalidFields).filter(k => !!state.invalidFields[k]).length
  }

  if (action.type === 'create-form.player/submitted') {
    state = Object.assign({}, state)
    state.submitted = true
  }

  if (action.type === 'create-form.team/submitted') {
    state = Object.assign({}, state)
    state.submitted = true
  }

  if (action.type === 'directory.create-player/success') {
    state = Object.assign({}, state)
    state.submitted = false
  }

  if (action.type === 'directory.create-team/success') {
    state = Object.assign({}, state)
    state.submitted = false
  }
  return state
}
