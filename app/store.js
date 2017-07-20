import { compose, applyMiddleware, createStore, combineReducers } from 'redux'
import { createLogger as createLoggerMiddleware } from 'redux-logger'
import thunkMiddleware from 'redux-thunk'

import createHistory from 'history/createHashHistory'
import { routerReducer, routerMiddleware } from 'react-router-redux'
import teamReducers from './reducers/team-reducers'
import directoryReducers from './reducers/directory-reducers'
import navigationReducers from './reducers/navigation-reducers'
import gameReducers from './reducers/game-reducers'
import playerReducers from './reducers/player-reducers'
import formReducers from './reducers/form-reducers'

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
  form: formReducers
})

export const store = createStore(rootReducer, undefined, enhancers)
