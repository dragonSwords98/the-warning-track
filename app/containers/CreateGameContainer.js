import React, { Component } from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router'

import moment from 'moment'
import { Segment, Table, Header, Select, Button } from 'semantic-ui-react'

import GenericCelledTable from '@track/components/GenericCelledTable'
import SortableUnorderedList from '@track/components/SortableUnorderedList'
import CreateGameForm from '@track/components/CreateGameForm'

import { updateLineups, updateGameForm } from '@track/actions/game-actions'
import { fetchDirectory } from '@track/actions/directory-actions' // CR: looks like it don't belong as a 'directory' state

import { populateOptions } from '@track/utils'

class CreateGameContainer extends Component {
  componentWillMount () {
    this.props.init()
  }

  componentWillUnmount () {
    this.props.destroy()
  }

  render () {
    const {
      game,
      directory,
      toggleInningLock,
      submitCreateFormQuery,
      updateCreateFormQuery,
      handleRosterOptions,
      handleBattingOrder
    } = this.props

    let leagueOptions = [], diamondOptions = []
    if (directory.leagues) {
      leagueOptions = populateOptions(directory.leagues)
    }
    if (directory.diamonds) {
      diamondOptions = populateOptions(directory.diamonds)
    }

    // TODO: Should be in redux...
    let teamOptions = [], rosterOptions = []
    if (directory.teams) {
      let availableTeams = Object.assign([], directory.teams)
      if (game.league) {
        availableTeams = availableTeams.filter(t => t.leagues.includes(game.league._id))
      }
      teamOptions = populateOptions(availableTeams)
    }
    if (directory.players) {
      let availablePlayers = Object.assign([], directory.players)
      if (game.ourTeam) {
        availablePlayers = availablePlayers.filter(p => p.teams.includes(game.ourTeam))
      }
      rosterOptions = populateOptions(availablePlayers)
    }

    let fielderCells = [],
        header = [<Table.HeaderCell key={'header-innings-0'}></Table.HeaderCell>],
        body = [],
        footer = [<Table.HeaderCell key='footer-cell-0'>Lock</Table.HeaderCell>]

    if (game.league) {
      for (let i = 1; i <= game.league.innings; i++) {
        let select = <Select compact placeholder="Player" options={rosterOptions} onChange={handleRosterOptions} />
        if (game.lockedInnings.indexOf(i) > -1) {
          select = <Select compact placeholder="Player" options={rosterOptions} onChange={handleRosterOptions} disabled />
        }
        fielderCells.push(
          <Table.Cell key={'fielder-cell-' + i}>
            { select }
          </Table.Cell>
        )
      }

      for (let i = 1; i <= game.league.innings; i++) {
        header.push(<Table.HeaderCell key={'header-innings' + i}>{ i }</Table.HeaderCell>)
      }

      for (let p = 0; p < game.league.positions.length; p++) {
        body.push(
          <Table.Row key={'fielder-row-' + p}>
            <Table.Cell><Header as='h4'>{ game.league.positions[p] }</Header></Table.Cell>
            {fielderCells}
          </Table.Row>
        )
      }

      for (let i = 1; i <= game.league.innings; i++) {
        let icon = game.lockedInnings.indexOf(i) > -1 ? 'lock' : 'unlock'
        footer.push(
          <Table.HeaderCell key={'footer-cell-' + i}>
            <Button data={i} circular icon={icon} onClick={toggleInningLock} />
          </Table.HeaderCell>
        )
      }
    }

    let rosterList = []
    rosterList = rosterOptions.map(function(r) {
      return r.text
    })

    let dateRange = {
      min: moment().format('YYYY-MM-DD'),
      max: moment().add(1, 'years').format('YYYY-MM-DD')
    }
    // TODO: Add a tally table
    // TODO: find a way to extract the final order of the roster batting lineup
    //       and restrict the ordering to MMF or MMMF if optioned
    // TODO: fix submit button and its actions
    return (
      <div className='create-game-container'>
        <Segment>
          <CreateGameForm
            submitCreateGameForm={submitCreateFormQuery}
            leagueOptions={leagueOptions}
            teamsOptions={teamOptions}
            labelHomeOrAway={game.homeOrAway}
            diamondOptions={diamondOptions}
            dateRange={dateRange}
            handleFormChange={updateCreateFormQuery} />
        </Segment>
        <Segment>
          <GenericCelledTable header={header} body={body} footer={footer} />
        </Segment>
        <Segment>
          <SortableUnorderedList id='roster-sortable-list-create-game' items={rosterList} onChange={handleBattingOrder} />
        </Segment>
        <Segment>
          <Button type="submit" form="createGameForm">Submit</Button>
        </Segment>
      </div>
    )
  }
}
export default withRouter(connect(
  function mapStateToProps (state, ownProps) {
    return {
      directory: state.directory,
      // createGame: state.createGame,
      game: state.game
    }
  },
  function mapDispatchToProps (dispatch, ownProps) {
    return {
      init () {
        dispatch({ type: 'route.directory-list/fetch' })
        dispatch(fetchDirectory('teams'))
        dispatch(fetchDirectory('players'))
        // CR: Clear out old game first?
        // 1) populate list of available teams to pick
        // 2) show create game form
      },
      toggleInningLock (event, data) {
        dispatch({ type: 'create-game.lock-inning/toggle', payload: { inning: data.data } })
      },
      handleRosterOptions (event, data) {
        dispatch(updateLineups(event, data))
      },
      handleBattingOrder (event, data) {
        dispatch({ type: 'create-game.batting-order/change', payload: { event: event, data: data }})
      },
      updateCreateFormQuery (event, data) {
        dispatch(updateGameForm(event, data))
        // dispatch({ type: 'create-game.form/update', payload: { type: "games", field: data['data-create-id'], value: data.value } })
      },
      submitCreateFormQuery (event, data) {
        event.preventDefault()
        console.log(event, data)
        dispatch({ type: 'create-game.form/submit', payload: { event: event, data: data } })
      },
      destroy () {
        dispatch({ type: 'route.create-game-container/destroy' })
      }
    }
  }
)(CreateGameContainer))
