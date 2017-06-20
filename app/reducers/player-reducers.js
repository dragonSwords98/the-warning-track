'use strict'

const INITIAL_STATE = {
  name: 'Anonymous Chan',
  image: 'anonymous-chan.jpg',
  gender: 0,
  birthyear: 1990,
  jersey: 50,
  throws: 'Right',
  hits: 'Right',
  positions: [],
  teams: []
}

export default function playerReducers (state = INITIAL_STATE, action) {
  if (action.type === 'route.player-container/init') {
    state = Object.assign({}, state, INITIAL_STATE)
    return state
  }

  if (action.type === 'route.player-container/destroy') {
    state = Object.assign({}, state)
    state = null
    return state
  }

  if (action.type === 'fetch-player/received') {
    state = Object.assign({}, state)
    state.name = action.payload.player.name
    state.jersey = action.payload.player.jersey
    return state
  }

  if (action.type === 'directory.create-player/update') {
    state = Object.assign({}, state)
    if (action.payload.field === 'name') {
      let fullName = action.payload.value.split(' ')
      let lowerFirst = fullName[0][0].toLowerCase() + fullName[0].slice(1)
      let lowerLast = ''
      if (fullName[1]) {
        lowerLast = fullName[1][0].toLowerCase() + fullName[1].slice(1)
      }
      state.image = `${lowerFirst}-${lowerLast}.jpg`
    }
    state[action.payload.field] = action.payload.value
  }

  if (action.type === 'directory.create-player/success') {
    state = Object.assign({}, state, INITIAL_STATE)
  }
  return state
}
