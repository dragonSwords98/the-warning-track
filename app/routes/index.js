import React from 'react'
import { Switch, Redirect, Route } from 'react-router-dom'
// import playersRoutes from './playersRoutes'
// import teamsRoutes from './teamsRoutes'
export default (
  <Switch>
    <Route exact path="/" render={() => <Redirect to="/" />} />
    <Route path="/teams/:teamId" render={function ({match}) {
       const teamId = parseInt(match.params.teamId)
       return (
         <ManageableContainer reportableType="team" reportableId={teamId}>
           <Switch>
             <Route exact path="/teams/:teamId">
               <Redirect to={`/teams/${teamId}/dashboard`} />
             </Route>
             <Route exact path="/teams/:teamId/dashboard">
               <ReportableDashboard type="team" id={teamId} />
             </Route>
             <Route
               exact path="/teams/:teamId/:teamName"
               render={
                 ({ match }) => (
                   <TeamContainer teamName={match.params.teamName} />
                 )
               } />
             <Route render={() => <Redirect to="/" />} />
           </Switch>
         </ManageableContainer>
       )
     }} />
     <Route path="/players/:playerId" render={function ({match}) {
        const teamId = parseInt(match.params.playerId)
        return (
          <ManageableContainer reportableType="player" reportableId={playerId}>
            <Switch>
              <Route exact path="/players/:playerId">
                <Redirect to={`/players/${playerId}/dashboard`} />
              </Route>
              <Route exact path="/players/:playerId/dashboard">
                <ReportableDashboard type="player" id={playerId} />
              </Route>
              <Route
                exact path="/players/:playerId/:playerName"
                render={
                  ({ match }) => (
                    <PlayerContainer teamName={match.params.playerName} />
                  )
                } />
              <Route render={() => <Redirect to="/" />} />
            </Switch>
          </ManageableContainer>
        )
      }} />
    <Route render={() => <Redirect to="/" />} />
  </Switch>
)
