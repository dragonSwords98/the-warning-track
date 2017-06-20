'use strict'

const INITIAL_STATE = {
  name: '',
  captain: [],
  leagues: [],
  roster: [], // TODO: this is not a field we store in MongoDB Team Collection, instead, the server side of API should pick up this roster and make appropriate updates to Players Collection
  size: 0
  // color: null,
  // schedule: {},
  // standings: {}
}

export default function teamReducers (state = INITIAL_STATE, action) {
  if (action.type === 'route.team-container/init') {
    state = Object.assign({}, state, INITIAL_STATE)
  }

  if (action.type === 'route.team-container/destroy') {
    state = Object.assign({}, state, INITIAL_STATE)
  }

  if (action.type === 'directory.create-team/update') {
    state = Object.assign({}, state)
    state[action.payload.field] = action.payload.value
    if (action.payload.field === 'roster') {
      state.size = state.roster.length
    }
  }

  if (action.type === 'directory.create-team/success') {
    state = Object.assign({}, state, INITIAL_STATE)
  }
  return state
}
