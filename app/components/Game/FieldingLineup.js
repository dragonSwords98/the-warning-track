'use strict'
import React from 'react'
import PropTypes from 'prop-types'
import { Grid, Segment, List } from 'semantic-ui-react'

function FieldingLineup ({ positions, fielding, currentInning }) {
  return (
    <Segment padded>
      <Grid columns={fielding.length + 1} divided>
        <Grid.Column key={'fielding-grid0'}>
          <List key={'fielding-list0'} animated selection relaxed>
            <List.Item key={'fielding-list-title'}>
              <List.Header>Positions</List.Header>
            </List.Item>
            {
              positions.map((p, i) => {
                return (<List.Item key={i + '-' + p}>{p}</List.Item>)
              })
            }
          </List>
        </Grid.Column>
        {
          fielding.map((inningLineup, inning) => {
            return (
              <Grid.Column key={'fielding-grid' + inning}>
                <List key={'fielding-list' + inning} animated selection relaxed>
                  <List.Item key={inning + '-head'}>
                    <List.Header>{inning + 1}</List.Header>
                  </List.Item>
                  {
                    inningLineup.map((fielder) => {
                      return (<List.Item key={inning + '-' + fielder._id} disabled={currentInning - 1 !== inning}>{fielder.name}</List.Item>)
                    })
                  }
                </List>
              </Grid.Column>
            )
          })
        }
      </Grid>
    </Segment>
  )
}
FieldingLineup.propTypes = {
  positions: PropTypes.array.isRequired,
  fielding: PropTypes.array.isRequired,
  currentInning: PropTypes.number.isRequired
}
export default FieldingLineup
