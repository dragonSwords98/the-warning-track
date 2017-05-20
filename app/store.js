import { compose, applyMiddleware, createStore, combineReducers } from 'redux'
import { createLogger as createLoggerMiddleware } from 'redux-logger'
import thunkMiddleware from 'redux-thunk'

import createHistory from 'history/createHashHistory'
import { routerReducer, routerMiddleware } from 'react-router-redux'

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
  router: routerReducer
})

export const store = createStore(rootReducer, undefined, enhancers)
