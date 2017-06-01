import React, { Component } from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router'

import moment from 'moment'
import { Segment, Table, Header, Select, Button, Icon, Divider } from 'semantic-ui-react'

import GenericCelledTable from '@track/components/GenericCelledTable'
import SortableUnorderedList from '@track/components/SortableUnorderedList'
import CreateGameForm from '@track/components/CreateGameForm'

import { setLeague } from '@track/actions/game-actions'

class CreateGameContainer extends Component {
  componentWillMount () {
    this.props.init()
  }

  componentWillUnmount () {
    this.props.destroy()
  }

  render () {
    const { game, team } = this.props

    let leagueOptions = [
      { key: 'ccsa', value: 'ccsa', flag: 'ca', text: 'CCSA' },
      { key: 'sssl', value: 'sssl', flag: 'ca', text: 'SSSL' },
      { key: 'snsp', value: 'snsp', flag: 'ca', text: 'SNSP' },
      { key: 'nl', value: 'nl', flag: 'ca', text: 'Nations League' }
    ]

    let teamsOptions = [
      { key: 'lt', value: 'lt', flag: 'ca', text: 'Looney Tunes' },
      { key: 'bd', value: 'bd', flag: 'ca', text: 'Bolders' },
      { key: 'kt', value: 'kt', flag: 'ca', text: 'Kattalage' }
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
    let rosterOptions = [
      { key: 'bl98', value: 'bl98', text: 'Bryan Ling' },
      { key: 'sl52', value: 'sl52', text: 'Sinto Ling' },
      { key: 'cl6', value: 'cl6', text: 'Chris Lo' },
      { key: 'sk5', value: 'sk5', text: 'Sam Kwok' }
    ]

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


    let rosterList = rosterOptions.map(function(r) {
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
                teamsOptions={teamsOptions}
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
      game: state.game,
      team: state.team
    }
  },
  function mapDispatchToProps (dispatch, ownProps) {
    return {
      init () {
        dispatch({ type: 'route.create-game-container/init' })
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
