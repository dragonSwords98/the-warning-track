import React, { Component } from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router'

import moment from 'moment'
import { Segment, Table, Header, Select, Button } from 'semantic-ui-react'

import GenericCelledTable from '@track/components/GenericCelledTable'
import SortableUnorderedList from '@track/components/SortableUnorderedList'
import CreateGameForm from '@track/components/CreateGameForm'

import { setLeague } from '@track/actions/game-actions'
import { fetchDirectory } from '@track/actions/directory-actions' // CR: looks like it don't belong as a 'directory' state

const populateOptions = function(data) {
  return data.map((d => {
    return {
      key: d._id,
      value: d._id,
      text: d.name
    }
  }))
}

class CreateGameContainer extends Component {
  componentWillMount () {
    this.props.init()
  }

  componentWillUnmount () {
    this.props.destroy()
  }

  render () {
    const { game, directory, createGameSubmitForm } = this.props

    let rosterOptions = [], teamOptions = [], leagueOptions = [], diamondOptions = []
    if (directory.players) {
      rosterOptions = populateOptions(directory.players)
    }
    if (directory.teams) {
      teamOptions = populateOptions(directory.teams)
    }
    if (directory.leagues) {
      leagueOptions = populateOptions(directory.leagues)
    }
    if (directory.diamonds) {
      diamondOptions = populateOptions(directory.diamonds)
    }

    let handleRosterOptions = function() {
      // TODO: Select should remove options as they are chosen in an inning
      console.log('NYI: handleRosterOptions!')
    }

    let fielderCells = [],
        header = [<Table.HeaderCell key={'header-innings-0'}></Table.HeaderCell>],
        body = [],
        footer = [<Table.HeaderCell key='footer-cell-0'>Lock</Table.HeaderCell>]

    console.log('render', game.league)
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
            <Button data={i} circular icon={icon} onClick={this.props.toggleInningLock} />
          </Table.HeaderCell>
        )
      }
    }

    let rosterList = []
    rosterList = rosterOptions.map(function(r) {
      return r.text
    })

    let dateRange = {
      min: moment(),
      max: moment() // set to one year in advance?
    }
    // TODO: Add a tally table
    // TODO: find a way to extract the final order of the roster batting lineup
    //       and restrict the ordering to MMF or MMMF if optioned
    // TODO: fix submit button and its actions
    return (
      <div className='create-game-container'>
        <Segment>
          <CreateGameForm
            submitCreateGameForm={createGameSubmitForm}
            leagueOptions={leagueOptions}
            handleSelectLeague={this.props.setLeague}
            teamsOptions={teamOptions}
            labelHomeOrAway={game.homeOrAway}
            setHomeOrAway={this.props.setHomeOrAway}
            diamondOptions={diamondOptions}
            dateRange={dateRange} />
        </Segment>
        <Segment>
          <GenericCelledTable header={header} body={body} footer={footer} />
        </Segment>
        <Segment>
          <SortableUnorderedList id='roster-sortable-list-create-game' items={rosterList}/>
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
      setLeague (event, data) {
        dispatch(setLeague(data.value))
      },
      setHomeOrAway (event, data) {
        dispatch({ type: 'create-game.home-or-away/set', payload: { isHome: data.checked } })
      },
      createGameSubmitForm (event, data) {
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
