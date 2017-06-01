import React from 'react'
import { Switch, Redirect, Route } from 'react-router-dom'

import Directory from '@track/containers/Directory'

import teamRoutes from './teamRoutes'
import playerRoutes from './playerRoutes'
import gameRoutes from './gameRoutes'

export default (
  <Switch>
    <Route exact path="/" render={() => <Redirect to="/teams" />} />
    <Route exact path="/teams">
      <Directory type="teams" />
    </Route>
    <Route exact path="/players">
      <Directory type="players" />
    </Route>

    { teamRoutes }
    { playerRoutes }
    { gameRoutes }

    <Route render={() => <Redirect to="/" />} />
  </Switch>
)
