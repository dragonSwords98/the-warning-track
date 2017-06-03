import React, { Component } from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router'

import moment from 'moment'
import { Segment, Table, Header, Select, Button, Icon, Divider } from 'semantic-ui-react'

import GenericCelledTable from '@track/components/GenericCelledTable'
import SortableUnorderedList from '@track/components/SortableUnorderedList'
import CreateGameForm from '@track/components/CreateGameForm'

import { setLeague } from '@track/actions/game-actions'
import { fetchDirectory } from '@track/actions/directory-actions' // CR: looks like it don't belong as a 'directory' state

class CreateGameContainer extends Component {
  componentWillMount () {
    this.props.init()
  }

  componentWillUnmount () {
    this.props.destroy()
  }

  render () {
    const { game, team, directory } = this.props

    let rosterOptions = [], teamOptions = []
    if (directory.players) {
      rosterOptions = directory.players.map((player) => {
        return {
          key: player._id,
          value: player._id,
          text: player.name
        }
      })
    }
    if (directory.teams) {
      teamOptions = directory.teams.map((team) => {
        return {
          key: team._id,
          value: team._id,
          text: team.name
        }
      })
    }

    let leagueOptions = [
      { key: 'ccsa', value: 'ccsa', text: 'CCSA' },
      { key: 'sssl', value: 'sssl', text: 'SSSL' },
      { key: 'snsp', value: 'snsp', text: 'SNSP' },
      { key: 'nl', value: 'nl', text: 'Nations League' }
    ]

    let diamondOptions = [
      { key: 'gl', value: 'gl', flag: 'ca', text: 'Glamorgan' },
      { key: 'am', value: 'am', flag: 'ca', text: 'L\'Amoreaux' },
      { key: 'mh', value: 'mh', flag: 'ca', text: 'Muirhead' },
      { key: 'or', value: 'or', flag: 'ca', text: 'Oriole' },
      { key: 'ml', value: 'ml', flag: 'ca', text: 'Milliken' },
      { key: 'gh', value: 'gh', flag: 'ca', text: 'Goldhawk' },
      { key: 'iq', value: 'iq', flag: 'ca', text: 'Iroquois' },
      { key: 'fs', value: 'fs', flag: 'ca', text: 'Fenside' },
      { key: 'ww', value: 'ww', flag: 'ca', text: 'Wishing Well' }
    ]

    let handleRosterOptions = function() {
      // TODO: Select should remove options as they are chosen in an inning
    }

    let fielderCells = []
    for (let i = 1; i <= game.innings; i++) {
      let select = <Select compact placeholder='Player' options={rosterOptions} onChange={handleRosterOptions} />
      if (game.lockedInnings.indexOf(i) > -1) {
        select = <Select compact placeholder='Player' options={rosterOptions} onChange={handleRosterOptions} disabled />
      }
      fielderCells.push(
        <Table.Cell key={'fielder-cell-' + i}>
          { select }
        </Table.Cell>
      )
    }

    let header = [<Table.HeaderCell key={'header-innings-0'}></Table.HeaderCell>]
    for (let i = 1; i <= game.innings; i++) {
        header.push(<Table.HeaderCell key={'header-innings' + i}>{ i }</Table.HeaderCell>)
    }

    let body = []
    for (let p = 0; p < game.positions.length; p++) {
        body.push(
            <Table.Row key={'fielder-row-' + p}>
                <Table.Cell><Header as='h4'>{ game.positions[p] }</Header></Table.Cell>
                {fielderCells}
            </Table.Row>
        )
    }

    let footer = [<Table.HeaderCell key='footer-cell-0'>Lock</Table.HeaderCell>]
    for (let i = 1; i <= game.innings; i++) {
      let icon = game.lockedInnings.indexOf(i) > -1 ? 'lock' : 'unlock'
      footer.push(
        <Table.HeaderCell key={'footer-cell-' + i}>
          <Button data={i} circular icon={icon} onClick={this.props.toggleInningLock} />
        </Table.HeaderCell>
      )
    }

    let rosterList = []
    rosterList = rosterOptions.map(function(r) {
        return r.text
    })

    let submitCreateGame = function () {
      console.log('submit form!')
    }
    let dateRange = {
      min: moment(),
      max: moment() // set to one year in advance?
    }

    return (
        <div className='create-game-container'>
            <Segment>
              <CreateGameForm
                submitCreateGameForm={submitCreateGame}
                leagueOptions={leagueOptions}
                handleSelectLeague={this.props.setLeague}
                teamsOptions={teamOptions}
                labelHomeOrAway={game.homeOrAway}
                setHomeOrAway={this.props.setHomeOrAway}
                diamondOptions={diamondOptions}
                dateRange={dateRange}
              />
            </Segment>
            <Segment>
                <GenericCelledTable header={header} body={body} footer={footer} />
            </Segment>
            <Segment>
                <SortableUnorderedList id='roster-sortable-list-create-game' items={rosterList}/>
            </Segment>
            <Segment>
                <Button icon='military' />
            </Segment>
        </div>
    ) // TODO: Add a tally table
    // TODO: find a way to extract the final order of the roster batting lineup and restrict the ordering to MMF or MMMF if optioned
  }
}
export default withRouter(connect(
  function mapStateToProps (state, ownProps) {
    return {
      directory: state.directory,
      game: state.game,
      team: state.team
    }
  },
  function mapDispatchToProps (dispatch, ownProps) {
    return {
      init () {
        dispatch({ type: 'route.create-game-container/init' })
        dispatch({ type: 'route.directory-list/fetch' })
        dispatch(fetchDirectory('teams'))
        dispatch(fetchDirectory('players'))
        // CR: Clear out old game first?
        // dispatch(init())

        // 1) populate list of available teams to pick
        // 2) show create game form

      },
      toggleInningLock (event, data) {
        dispatch({ type: 'create-game.lock-inning/toggle', payload: { inning: data.data }})
      },
      setLeague (event, data) {
        dispatch(setLeague(data.value))
      },
      setHomeOrAway (event, data) {
        dispatch({ type: 'create-game.home-or-away/set', payload: { isHome: data.checked } })
      },
      // createGame (gameId) {
      //   // CR: Clear out old game first?
      //   dispatch({ type: 'route.game-container/new-game', payload: { gameId: gameId }})
      //   createGame(gameId)
      // },
      // initGame (id) {
      //   dispatch({ type: 'route.team-container/init', payload: { id: id } })
      //   fetchGame(id)
      // },
      destroy () {
        dispatch({ type: 'route.create-game-container/destroy' })
      }
    }
  }
)(CreateGameContainer))
