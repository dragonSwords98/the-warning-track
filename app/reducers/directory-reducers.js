'use strict'

const INITIAL_STATE = {
  teams: null,
  players: null,
  games: null,
  showCreateForm: false,
  createPlayer: {},
  createTeam: {},
  createGame: {}
}

export default function directoryReducers(state = INITIAL_STATE, action) {
  if (action.type === 'route.directory-list/init') {
    state = Object.assign({}, state, INITIAL_STATE)
    return state
  }
  if (action.type === 'route.directory-list/destroy') {
    state = Object.assign({}, state)
    state.teams = null
    state.players = null
    state.games = null
    return state
  }

  if (action.type === 'fetch-directory.teams/received') {
    state = Object.assign({}, state)
    state.teams = action.payload.teams
    return state
  }

  if (action.type === 'fetch-directory.players/received') {
    state = Object.assign({}, state)
    state.players = action.payload.players
    return state
  }

  if (action.type === 'fetch-directory.games/received') {
    state = Object.assign({}, state)
    state.games = action.payload.games
    return state
  }

  if (action.type === 'route.directory-list/toggle-create-form') {
    state = Object.assign({}, state)
    state.showCreateForm = !state.showCreateForm
    return state
  }

  if (action.type === 'route.directory-list/update-form-query') {
    state = Object.assign({}, state)
    if (action.payload.type === 'players') {
      state.createPlayer[action.payload.field] = action.payload.value
    }
    if (action.payload.type === 'teams') {
      state.createTeam[action.payload.field] = action.payload.value
    }
    if (action.payload.type === 'games') {
      state.createGame[action.payload.field] = action.payload.value
    }
    return state
  }

  if (action.type === 'directory.team/new-team-success') {
    state = Object.assign({}, state)
    state.createTeam = {}
    return state
  }

  if (action.type === 'directory.player/new-player-success') {
    state = Object.assign({}, state)
    state.createPlayer = {}
    return state
  }

  
  return state
}
