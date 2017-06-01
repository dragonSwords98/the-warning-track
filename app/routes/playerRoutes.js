import React from 'react'
import { Switch, Redirect, Route } from 'react-router-dom'
import PlayerContainer from '@track/containers/PlayerContainer'

export default (

  <Route path="/players/:playerId" render={function ({match}) {
    const playerId = parseInt(match.params.playerId)
    const playerName = parseInt(match.params.playerName)
    return (
      <Switch>
        <Route exact path="/players/:playerId">
          <Redirect to={`/players/${playerId}/${playerName}`} />
        </Route>
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
