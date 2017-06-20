'use strict'
import React from 'react'
import { Button, Header, Segment, Icon } from 'semantic-ui-react'

const square = { width: 175, height: 175 }

function Segue ({ children, teams, goToGame }) {
  let content = children.map(function (child) {
    let homeTeamRuns = 0
    let awayTeamRuns = 0
    let ourTeam = teams.find(t => t._id === child.ourTeam)
    if (child.scoresheet.length) {
      homeTeamRuns = child.scoresheet[0].reduce((a, b) => a + b, 0)
      awayTeamRuns = child.scoresheet[1].reduce((a, b) => a + b, 0)
    }
    let frameIndicator = child.currentFrame ? (<Icon name="chevron up" size="mini" />) : (<Icon name="chevron down" size="mini" />)

    const GAME_STATUS_COLOR_INDICATOR = ['green', 'red', 'grey']
    let colorLabel = GAME_STATUS_COLOR_INDICATOR[child.gameStatus]

    return (
      <Button circular key={'game-' + child._id} data-game-id={child._id} onClick={goToGame}>
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
