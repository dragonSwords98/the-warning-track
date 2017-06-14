'use strict'

const INITIAL_STATE = {
  // team: null,
  team: null,
  name: '',
  captain: [],
  leagues: [],
  roster: []
  // roster: [],
  // color: null,
  // schedule: {},
  // standings: {}
  // rosterOptions: [
  //   { key: 'bl98', value: 'bl98', text: 'Bryan Ling' },
  //   { key: 'sl52', value: 'sl52', text: 'Sinto Ling' },
  //   { key: 'cl6', value: 'cl6', text: 'Chris Lo' },
  //   { key: 'sk5', value: 'sk5', text: 'Sam Kwok' }
  // ]
}

export default function teamReducers(state = INITIAL_STATE, action) {
  if (action.type === 'route.team-container/init') {
    state = Object.assign({}, state, INITIAL_STATE)
    return state
  }
  if (action.type === 'route.team-container/destroy') {
    state = Object.assign({}, state)
    state.team = null
    return state
  }

  if (action.type === 'fetch-team/received') {
    state = Object.assign({}, state)
    state.team = action.payload
    return state
  }
  return state
}
