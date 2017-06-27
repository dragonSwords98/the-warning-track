'use strict'
import React from 'react'
import PropTypes from 'prop-types'
import { Card, List, Icon } from 'semantic-ui-react'

function CardGrid ({ collection, type }) {
  const publicImageDir = '../images/'
  let grid = ''

  const extra = function (detail) {
    if (type === 'teams') {
      return (
        <List horizontal>
          <List.Item>
            <List.Content>
              <a href="javascript:void(0);"><Icon name="users" /> Roster ({detail})</a>
            </List.Content>
          </List.Item>
          <List.Item>
            <List.Content>
              <a href="javascript:void(0);"><Icon name="bar chart" /> Stats</a>
            </List.Content>
          </List.Item>
          <List.Item>
            <List.Content>
              <a href="javascript:void(0);"><Icon name="calendar" /> Schedule</a>
            </List.Content>
          </List.Item>
        </List>
      )
    }
    if (type === 'players') {
      return (
        <List horizontal>
          <List.Item>
            <List.Content>
              <a href="javascript:void(0);"><Icon name="hand lizard" /> Throws: {detail[0]}</a>
            </List.Content>
          </List.Item>
          <List.Item>
            <List.Content>
              <a href="javascript:void(0);"><Icon name="legal" /> Hits: {detail[1]}</a>
            </List.Content>
          </List.Item>
          <List.Item>
            <List.Content>
              <a href="javascript:void(0);"><Icon name="bar chart" /> Stats</a>
            </List.Content>
          </List.Item>
          <List.Item>
            <List.Content>
              <a href="javascript:void(0);"><Icon name="calendar" /> Schedule</a>
            </List.Content>
          </List.Item>
        </List>
      )
    }
  }

  if (type === 'teams') {
    grid = collection.map(entry => {
      return (
        <Card
          key={'card' + entry._id}
          image={publicImageDir + entry.image}
          header={entry.name}
          meta={entry.league}
          description={entry.description}
          href={`#/${type}/${entry._id}/${entry.name}`}
          extra={extra(entry.size)}
        />
      )
    })
  }
  if (type === 'players') {
    grid = collection.map(entry => {
      return (
        <Card
          key={'card' + entry._id}
          image={publicImageDir + entry.image}
          header={entry.name}
          meta={entry.teams[0]}
          description={entry.description}
          href={`#/${type}/${entry._id}/${entry.name}`}
          extra={extra([entry.throws, entry.hits])}
        />
      )
    })
  }
  return (
    <Card.Group>
      { grid }
    </Card.Group>
  )
}
CardGrid.propTypes = {
  collection: PropTypes.array.isRequired,
  type: PropTypes.string.isRequired
}
export default CardGrid
