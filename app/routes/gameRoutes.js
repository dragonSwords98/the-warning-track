import React from 'react'
import { Switch, Redirect, Route } from 'react-router-dom'
import GameContainer from '@track/containers/GameContainer'
import CreateGameContainer from '@track/containers/CreateGameContainer'

export default (
  <Switch>
    <Route exact path="/games/create">
      <CreateGameContainer />
    </Route>
    <Route path="/games/:gameId" render={function ({match}) {
      const gameId = match.params.gameId
      return (
        <Switch>
          <Route
            exact path="/games/:gameId"
            render={
              ({ match }) => (
                <GameContainer gameId={gameId} />
              )
            } />
          <Route render={() => <Redirect to="/" />} />
        </Switch>
      )
    }} />
    <Route render={() => <Redirect to="/" />} />
  </Switch>
)
