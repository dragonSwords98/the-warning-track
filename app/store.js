import { compose, applyMiddleware, createStore, combineReducers } from 'redux'
import { createLogger as createLoggerMiddleware } from 'redux-logger'
import thunkMiddleware from 'redux-thunk'

import createHistory from 'history/createHashHistory'
import { routerReducer, routerMiddleware } from 'react-router-redux'
import teamReducers from './reducers/team'
import directoryReducers from './reducers/directory'
import navigationReducers from './reducers/navigation'
import gameReducers from './reducers/game'
import playerReducers from './reducers/player'
import createGameReducers from './reducers/form/game'
import createReducers from './reducers/form/create'

let enhancedCompose
if (window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__) {
  enhancedCompose = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
} else {
  enhancedCompose = compose
}

export const history = createHistory()

let enhancers = enhancedCompose(
  applyMiddleware(
    thunkMiddleware,
    routerMiddleware(history),
    createLoggerMiddleware({
      collapsed: true
    })
  )
)

let rootReducer = combineReducers({
  router: routerReducer,
  navigation: navigationReducers,
  team: teamReducers,
  player: playerReducers,
  directory: directoryReducers,
  game: gameReducers,
  createGame: createGameReducers,
  create: createReducers
})

export const store = createStore(rootReducer, undefined, enhancers)
