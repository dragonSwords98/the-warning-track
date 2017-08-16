import React from 'react'
import { Switch, Redirect, Route } from 'react-router-dom'

import Directory from '@track/containers/Directory'
import App from '@track/containers/auth/App'
import Home from '@track/containers/auth/Home'
import Callback from '@track/containers/auth/Callback'
import Auth from '@track/containers/auth/Auth'
// import teamRoutes from './teamRoutes'
// import playerRoutes from './playerRoutes'
// import gameRoutes from './gameRoutes'

const auth = new Auth();

const handleAuthentication = (nextState, replace) => {
  // CR: Hacking the hash return of access token because we cannot deprecate hash routing at this time
  if (/access_token|id_token|error/.test(nextState.location.pathname)) {
    nextState.location.hash = nextState.location.pathname.substr(1)
    auth.handleAuthentication()
  }
}

export default (
    // <Route exact path="/" render={() => <Redirect to="/teams" />} />

    //     { teamRoutes }
    // { playerRoutes }
    // { gameRoutes }
    //    <Route render={(props) => <Redirect to="/" auth={auth} {...props} />} />
  <Switch>

    <Route exact path="/" render={(props) => <App auth={auth} {...props} />} />
    <Route exact path="/teams">
      <Directory type="teams" auth={auth} />
    </Route>
    <Route exact path="/players">
      <Directory type="players" auth={auth} />
    </Route>
    <Route exact path="/games">
      <Directory type="games" auth={auth} />
    </Route>
    <Route exact path="/home" render={(props) => <Home auth={auth} {...props} />} />
    <Route path="/callback" render={(props) => {
      handleAuthentication(props)
      return <Callback {...props} />
    }}/>

    <Route path="/access_token=*"  render={(props) => {
      handleAuthentication(props)
      return <Callback {...props} />
    }}/>
  </Switch>
)
