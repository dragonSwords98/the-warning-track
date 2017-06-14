import React from 'react'
import { Switch, Redirect, Route } from 'react-router-dom'
import GameContainer from '@track/containers/GameContainer'
import CreateGameContainer from '@track/containers/CreateGameContainer'
import Directory from '@track/containers/Directory'

export default (
  <Switch>
    <Route exact path="/games/create">
      <CreateGameContainer />
    </Route>
    <Route path="/games/:gameId" render={function ({match}) {
      const gameId = parseInt(match.params.gameId)
      return (
        <Switch>
          <Route
            exact path="/games/:gameId"
            render={
              ({ match }) => (
                <GameContainer />
              )
            } />
          <Route render={() => <Redirect to="/" />} />
        </Switch>
      )
      }} />
    <Route render={() => <Redirect to="/" />} />
  </Switch>
)

// Games -> directory for games