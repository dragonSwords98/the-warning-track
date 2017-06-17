
const teamOptions = [
  { key: 'lt', value: 'looney-tunes', text: 'Looney Tunes' },
  { key: 'bd', value: 'bolders', text: 'CCCF Bolders' }
]
const playerOptions = [
  { key: 'bling', value: 'bling', text: 'Bryan Ling' },
  { key: 'sling', value: 'sling', text: 'Sinto Ling' }
]

const INITIAL_STATE = {
  activeItem: 'teams',
  activeOptions: teamOptions
}

export default function navigationReducers (state = INITIAL_STATE, action) {
  if (action.type === 'app-menu/init') {
    state = Object.assign({}, state, INITIAL_STATE)
    state.activeItem = action.payload.path.replace('/', '')
    return state
  }
  if (action.type === 'app-menu/item-action') {
    state = Object.assign({}, state)
    state.activeItem = action.payload.name
    if (state.activeItem === 'teams') {
      state.activeOptions = teamOptions
    }
    if (state.activeItem === 'players') {
      state.activeOptions = playerOptions
    }
    return state
  }
  if (action.type === 'app-menu/select-action') {
    state = Object.assign({}, state)
    return state
  }

  return state
}
