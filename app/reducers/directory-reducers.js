'use strict'

const INITIAL_STATE = {
  teams: null,
  players: null,
  games: null,
  leagues: null,
  diamonds: null,
  showCreateForm: false
}

export default function directoryReducers (state = INITIAL_STATE, action) {
  if (action.type === 'directory-list/init') {
    state = Object.assign({}, state, INITIAL_STATE)
  }

  if (action.type === 'fetch-directory.leagues/received') {
    state = Object.assign({}, state)
    state.leagues = action.payload.leagues
  }

  if (action.type === 'fetch-directory.teams/received') {
    state = Object.assign({}, state)
    state.teams = action.payload.teams
  }

  if (action.type === 'fetch-directory.players/received') {
    state = Object.assign({}, state)
    state.players = action.payload.players
  }

  if (action.type === 'fetch-directory.games/received') {
    state = Object.assign({}, state)
    state.games = action.payload.games
  }

  if (action.type === 'fetch-directory.diamonds/received') {
    state = Object.assign({}, state)
    state.diamonds = action.payload.diamonds
  }

  if (action.type === 'route.directory-list/toggle-create-form') {
    state = Object.assign({}, state)
    if (!action.payload) state.showCreateForm = !state.showCreateForm
    else if (action.payload.hide) state.showCreateForm = false
  }

  // if (action.type === 'route.directory-list/update-form-query') {
  //   state = Object.assign({}, state) // TODO: should update the player or team state instead
  //   if (action.payload.type === 'players') {
  //     state.createPlayer[action.payload.field] = action.payload.value
  //   }
  //   if (action.payload.type === 'teams') {
  //     state.createTeam[action.payload.field] = action.payload.value
  //   }
  //   return state
  // }

  if (action.type === 'directory.create-team/success') {
    state = Object.assign({}, state)
    let newTeam = Object.assign(action.payload.newTeam)
    newTeam._id = action.payload._id
    state.teams.push(newTeam)
  }

  if (action.type === 'directory.create-player/success') {
    state = Object.assign({}, state)
    let newPlayer = Object.assign(action.payload.newPlayer)
    newPlayer._id = action.payload._id
    state.players.push(newPlayer)
  }

  if (action.type === 'route.game-container/create-game.success') {
    state = Object.assign({}, state)
    let newGame = Object.assign(action.payload.newGame)
    newGame._id = action.payload._id
    state.games.push(newGame)
  }

  return state
}
