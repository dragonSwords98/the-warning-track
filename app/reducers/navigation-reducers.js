const INITIAL_STATE = {
  activeItem: 'players',
  activeFilter: 'teams',
  activeOptions: [],
  placeholder: 'Filter by Team'
}

const setPlaceholder = function (state) {
  if (state.activeFilter === 'leagues') {
    state.placeholder = 'Filter by League'
  }
  if (state.activeFilter === 'teams') {
    state.placeholder = 'Filter by Team'
  }
}

export default function navigationReducers (state = INITIAL_STATE, action) {
  if (action.type === 'app-menu/init') {
    state = Object.assign({}, state, INITIAL_STATE)
    let location = action.payload.path.replace('/', '')
    state.activeItem = location

    if (location === 'teams') {
      state.activeFilter = 'leagues'
    } else if (location === 'players') {
      state.activeFilter = 'teams'
    } else if (location === 'games') {
      state.activeFilter = 'leagues'
    } else {
      // TODO: DEFAULT CASE
      state.activeFilter = null
    }
    setPlaceholder(state)
  }

  if (action.type === 'app-menu/item-action') {
    state = Object.assign({}, state)
    state.activeItem = action.payload.name
    state.activeFilter = action.payload.filter
    state.activeOptions = action.payload.options
    setPlaceholder(state)
  }

  if (action.type === 'app-menu/select-action') {
  }

  if (action.type === 'app-menu/clear-options') {
    state = Object.assign({}, state)
    state.activeOptions = []
  }

  return state
}
