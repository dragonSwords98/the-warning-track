'use strict'
import React from 'react'
import { Button, Header, Segment, Icon } from 'semantic-ui-react'

const square = { width: 175, height: 175 }

function Segue ({ children, teams, filter, goToGame }) {
  let content = children.map(function (child) {
    if (child.league !== filter && filter) {
      return
    }

    let homeTeamRuns = 0
    let awayTeamRuns = 0
    let ourTeam = teams.find(t => t._id === child.ourTeam)
    if (child.scoresheet.ours && child.scoresheet.theirs) {
      homeTeamRuns = child.scoresheet.ours.runs.reduce((a, b) => parseInt(a) + parseInt(b), 0)
      awayTeamRuns = child.scoresheet.theirs.runs.reduce((a, b) => parseInt(a) + parseInt(b), 0)
    }
    let frameIndicator = child.currentFrame ? (<Icon name="chevron up" size="mini" />) : (<Icon name="chevron down" size="mini" />)

    const GAME_STATUS_COLOR_INDICATOR = ['green', 'red', 'grey']
    let colorLabel = GAME_STATUS_COLOR_INDICATOR[child.status]

    return (
      <Button circular key={'game-' + child._id} data-game-id={child._id} onClick={goToGame} disabled={child.status}>
        <Segment circular color={colorLabel} style={square}>
          <Header as="h2">
            {homeTeamRuns} : {awayTeamRuns}
            <Header.Subheader>
              {ourTeam.name} vs {child.opposingTeam}
            </Header.Subheader>
            <Header.Subheader>
              I: {child.currentInning}{frameIndicator}
            </Header.Subheader>
          </Header>
        </Segment>
      </Button>
    )
  })
  return (
    <div>
      { content }
    </div>)
}

export default Segue
