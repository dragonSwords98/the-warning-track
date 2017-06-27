import React from 'react'
import { Switch, Redirect, Route } from 'react-router-dom'
import TeamContainer from '@track/containers/TeamContainer'

export default (

  <Route path="/teams/:teamId" render={function ({match}) {
    const teamId = match.params.teamId
    return (
      <Switch>
        <Route
          exact path="/teams/:teamId/:teamName"
          render={
            ({ match }) => (
              <TeamContainer teamId={teamId} teamName={match.params.teamName} />
            )
          } />
        <Route render={() => <Redirect to="/" />} />
      </Switch>
    )
  }} />
)
