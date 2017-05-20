import Promise from 'bluebird'
import React from 'react'
import { render } from 'react-dom'
import { Provider } from 'react-redux'
import { ConnectedRouter } from 'react-router-redux'
import { store, history } from './store'

Promise.config({
  warnings: true,
  longStackTraces: true,
  cancellation: true,
  monitoring: true
})
render(
  <Provider store={store}>
    <ConnectedRouter history={history}>
      <div>Hello World!</div>
    </ConnectedRouter>
  </Provider>,
  document.getElementById('root')
)
