import Promise from 'bluebird'

import React from 'react'
import { render } from 'react-dom'

import { Provider } from 'react-redux'
import { ConnectedRouter } from 'react-router-redux'

import 'semantic-ui-css/semantic.min.css'
import '@track/styles/styles.scss'

import { store, history } from './store'
import TrackApp from './containers/TrackApp'

Promise.config({
  warnings: true,
  longStackTraces: true,
  cancellation: true,
  monitoring: true
})

render(
  <Provider store={store}>
    <ConnectedRouter history={history} >
      <TrackApp />
    </ConnectedRouter>
  </Provider>,
  document.getElementById('root')
)
