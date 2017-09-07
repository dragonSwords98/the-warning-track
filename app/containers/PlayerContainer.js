import React, { Component } from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router'
import { Header, Segment, Grid, Table, Container, List, Image } from 'semantic-ui-react'

import { fetchPlayer } from '@track/actions/player'

class PlayerContainer extends Component {
  componentWillMount () {
    const { init, playerId } = this.props
    init(playerId)
  }
  componentWillUnmount () {
    this.props.destroy()
  }
  render () {
    const { player, playerId, playerName } = this.props

    if (!player || !playerId || !playerName) {
      return (<LoadingOverlay msg={"No Such Player"} />)
    }

    const positions = player.positions.map((p) =>
      <List.Item key={'player-' + p}>
        <List.Header>
          {p}
        </List.Header>
      </List.Item>
    )

    const swings = (
      <List.Item key='player-swing'>
        <List.Header>
          Swing: {player.hits}
        </List.Header>
      </List.Item>
    )
    const throws = (
      <List.Item key='player-throw'>
        <List.Header>
          Throw: {player.throws}
        </List.Header>
      </List.Item>
    )

    return (
      <div>
        <Segment>
          <Image centered size='medium' shape='circular' src={'/images/' + player.image} />
          <Header as='h2' textAlign='center'>
            <Header.Content>
              {playerName} | #{player.jersey}
            </Header.Content>
            <Header.Subheader>
              <List divided horizontal size='tiny'>
                {positions}
                {swings}
                {throws}
              </List>
            </Header.Subheader>
          </Header>
        </Segment>
        <Segment>
          <Header as='h3' textAlign='center'>
            Stats
          </Header>
          <Table>
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell>1</Table.HeaderCell>
                <Table.HeaderCell>2</Table.HeaderCell>
                <Table.HeaderCell>3</Table.HeaderCell>
                <Table.HeaderCell>4</Table.HeaderCell>
                <Table.HeaderCell>5</Table.HeaderCell>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              <Table.Row>
                <Table.Cell>1
                </Table.Cell>
                <Table.Cell>2
                </Table.Cell>
                <Table.Cell>3
                </Table.Cell>
                <Table.Cell>4
                </Table.Cell>
                <Table.Cell>5
                </Table.Cell>
              </Table.Row>
            </Table.Body>
          </Table>
        </Segment>
        <Segment>
          <Header as='h3' textAlign='center'>
            Charts
          </Header>
          <Grid>
            <Grid.Column width={4}>
              <Segment>1</Segment>
            </Grid.Column>
            <Grid.Column width={4}>
              <Segment>2</Segment>
            </Grid.Column>
            <Grid.Column width={4}>
              <Segment>3</Segment>
            </Grid.Column>
            <Grid.Column width={4}>
              <Segment>4</Segment>
            </Grid.Column>
          </Grid>
        </Segment>
      </div>)
  }
}
export default withRouter(connect(
  function mapStateToProps (state, ownProps) {
    return {
      player: state.player
    }
  },
  function mapDispatchToProps (dispatch, ownProps) {
    return {
      init (id) {
        dispatch(fetchPlayer(id))
      },
      destroy () {
        dispatch({ type: 'route.player-container/destroy' })
      }
    }
  }
)(PlayerContainer))
