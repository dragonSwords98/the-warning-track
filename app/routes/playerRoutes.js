import React from 'react'
import { Switch, Redirect, Route } from 'react-router-dom'
import PlayerContainer from '@track/containers/PlayerContainer'

export default (

  <Route path="/players/:playerId" render={function ({match}) {
    const playerId = match.params.playerId
    return (
      <Switch>
        <Route
          exact path="/players/:playerId/:playerName"
          render={
            ({ match }) => (
              <PlayerContainer playerId={playerId} playerName={match.params.playerName} />
            )
          } />
        <Route render={() => <Redirect to="/" />} />
      </Switch>
    )
  }} />
)
