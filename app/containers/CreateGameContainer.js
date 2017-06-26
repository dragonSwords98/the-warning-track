import React, { Component } from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router'
import { push as pushLocation } from 'react-router-redux'

import moment from 'moment'
import { Segment, Table, Header, Select, Button } from 'semantic-ui-react'

import LoadingOverlay from '@track/components/LoadingOverlay'
import GenericCelledTable from '@track/components/GenericCelledTable'
import SortableUnorderedList from '@track/components/SortableUnorderedList'
import Sortable from 'sortablejs'
import CreateGame from '@track/components/Form/CreateGame'

import { updateLineups, updateGameForm } from '@track/actions/game-actions'
import { fetchDirectory } from '@track/actions/directory-actions' // CR: looks like it don't belong as a 'directory' state

import { populateOptions } from '@track/utils'

const validateForm = function (game) {
  return !(game.ourTeam && game.opposingTeam && game.diamond != '' && game.datetime && game.league)
  // && game.ourBattingOrder.length > 0
    //  && game.ourFieldingLineup.length > 0) //TODO: ourFieldingLineup will not be empty, its children could be empty
}

class CreateGameContainer extends Component {
  componentWillMount () {
    this.props.init()
  }

  componentWillUnmount () {
    this.props.destroy()
  }

  componentDidMount () {
    let sortable
    const el = document.getElementById("roster-sortable-list-create-game")
    if (el) {
      sortable = Sortable.create(el, {
        // onUpdate: function (evt) {
        //   console.log(this.toArray(), evt.target, evt.item, )
        // },
        onUpdate: evt => {
          let newOrder = []
          Array.prototype.forEach.call(evt.target.children, function(el, i){
            newOrder.push(el.getAttribute('data-id'))
          });
          this.props.handleBattingOrder(newOrder)
        }
      })
    }
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

    if (!game || !directory || !directory.players || !directory.teams || !directory.games || !directory.leagues) {
      return (<LoadingOverlay />)
    }

    let leagueOptions = []
    let diamondOptions = []
    if (directory.leagues) {
      leagueOptions = populateOptions(directory.leagues)
    }
    if (directory.diamonds) {
      diamondOptions = populateOptions(directory.diamonds)
    }

    // TODO: Should be in redux...
    let teamOptions = []
    let rosterOptions = []
    let battingList = []
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

      battingList = availablePlayers.map(function(r) {
        return [r.name, r.gender]
      })
    }

    let fielderCells = []
    let header = []
    let body = []
    let footer = []
    if (game.league) {
      header = [<Table.HeaderCell key={'header-innings-0'} />]
      footer = [<Table.HeaderCell key="footer-cell-0">Lock</Table.HeaderCell>]
      for (let i = 1; i <= game.league.innings; i++) {
        let select = <Select fluid placeholder="Player" data-id={i + ':TODO:POSITION'} options={rosterOptions} onChange={handleRosterOptions} />
        if (game.lockedInnings.indexOf(i) > -1) {
          select = <Select fluid placeholder="Player" data-id={i + ':TODO:POSITION'} options={rosterOptions} onChange={handleRosterOptions} disabled />
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
            <Table.Cell><Header as="h4">{ game.league.positions[p] }</Header></Table.Cell>
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


    let dateRange = {
      min: game.datetime,
      max: moment(game.datetime).add(1, 'years').format('YYYY-MM-DD')
    }

    let isFormIncomplete = validateForm(game)
    // TODO: Add a tally table
    // TODO: find a way to extract the final order of the roster batting lineup
    //       and restrict the ordering to MMF or MMMF if optioned
    // TODO: fix submit button and its actions
    return (
      <div className="create-game-container">
        <Segment>
          <CreateGame
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
          <SortableUnorderedList id="roster-sortable-list-create-game" items={battingList} onChange={handleBattingOrder} />
        </Segment>
        <Segment>
          <Button type="submit" form="createGameForm" disabled={isFormIncomplete}>Submit</Button>
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
        dispatch({ type: 'route.game-container/init' })
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
      handleBattingOrder (newOrder) {
        dispatch({ type: 'create-game.batting-order/change', payload: { newOrder: newOrder } })
      },
      updateCreateFormQuery (event, data) {
        dispatch(updateGameForm(event, data))
      },
      submitCreateFormQuery (event, data) {
        event.preventDefault()
        dispatch(submitGameForm(event, data))
        dispatch(pushLocation('/games')) //TODO: might not go here
      },
      destroy () {
        dispatch({ type: 'route.game-container/destroy' })
      }
    }
  }
)(CreateGameContainer))
