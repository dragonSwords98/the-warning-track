import React, { Component } from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router'

import moment from 'moment'
import { Segment, Table, Header, Button } from 'semantic-ui-react'

import LoadingOverlay from '@track/components/LoadingOverlay'
import GenericCelledTable from '@track/components/GenericCelledTable'
import SortableUnorderedList from '@track/components/SortableUnorderedList'
import Sortable from 'sortablejs'

import CreateGame from '@track/components/Form/CreateGame'
import FielderRow from '@track/components/Game/FielderRow'

import {
  createGameFormWithDefaults,
  updateAvailableLeagues,
  updateAvailableTeams,
  updateAvailableRoster,
  updateAvailableBatters,
  updateLineups,
  autoFillFieldingLineup,
  updateGameForm,
  submitGameForm
} from '@track/actions/form/game'

import { objectToOption } from '@track/utils'

const validateForm = function (game) {
  return !(game.ourTeam && game.opposingTeam && (game.diamond !== '') && game.dateTime && game.league)
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

  componentWillReceiveProps (nextProps) {
    if (nextProps.directory.leagues && !nextProps.createGame.leagues.length) {
      nextProps.updateAvailableLeagues(nextProps.directory.leagues)
    }
    if (nextProps.directory.diamonds && !nextProps.createGame.diamonds.length) {
      nextProps.populateOptions('diamonds', objectToOption(nextProps.directory.diamonds))
    }
    if (nextProps.directory.teams && !nextProps.createGame.teams.length) {
      nextProps.updateAvailableTeams(nextProps.directory.teams)
    }
    if (nextProps.directory.players && !nextProps.createGame.roster.length) {
      nextProps.updateAvailableRoster(nextProps.directory.players)
    }

    if (nextProps.createGame.batters && document.getElementById('battingOrderList')) {
      const el = document.getElementById('battingOrderList')
      if (!this.props.sortable && el) {
        this.setState((prevState, props) => {
          return {
            sortable: Sortable.create(el, {
              onUpdate: evt => {
                let newOrder = []
                Array.prototype.forEach.call(evt.target.children, function (el, i) {
                  newOrder.push(el.getAttribute('data-id'))
                })
                this.props.handleBattingOrder(newOrder)
              }
            })
          }
        })
        if (!nextProps.game.ourBattingOrder.length) {
          nextProps.handleBattingOrder(nextProps.createGame.batters)
        }
      }
    }
  }

  render () {
    const {
      game,
      createGame,
      directory,
      toggleInningLock,
      submitCreateFormQuery,
      updateCreateFormQuery,
      handleRosterOptions,
      handleBattingOrder,
      clearFielderRow,
      clearFielderInning,
      clearFielderAll,
      autoFillFielders
    } = this.props
    if (!game || !createGame ||
      !directory.players ||
      !directory.teams ||
      !directory.games ||
      !directory.leagues ||
      !directory.diamonds) {
      return (<LoadingOverlay msg={'Loading Game Creator...'} />)
    }

    let header = []
    let body = []
    let footer = []
    if (game.league) {
      header = [
        <Table.HeaderCell key={'header-innings-0'}>
            <Button circular icon='rocket' onClick={autoFillFielders} />
            <Button circular icon='bomb' onClick={clearFielderAll} />
        </Table.HeaderCell>]
      footer = [<Table.HeaderCell key="footer-cell-0">Lock</Table.HeaderCell>]

      for (let i = 1; i <= game.league.innings; i++) {
        header.push(
          <Table.HeaderCell key={'header-innings' + i}>
            { i + ' ' }
            <Button data={i} circular icon='erase' onClick={clearFielderInning} />
          </Table.HeaderCell>)
      }

      for (let p = 0; p < game.league.positions.length; p++) {
        let position = game.league.positions[p]
        body.push(
          <FielderRow key={'fielder-row-' + position}
            lineup={game.ourFieldingLineup.map(l => l[position])}
            innings={game.league.innings}
            lockedInnings={game.lockedInnings}
            position={position}
            options={createGame.roster}
            onChange={handleRosterOptions}
            clearFielderRow={clearFielderRow} />
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
      min: game.dateTime,
      max: moment(game.dateTime).add(1, 'years').format('YYYY-MM-DD')
    }

    let isFormIncomplete = validateForm(game)
    // TODO: Add a tally table
    // TODO: find a way to extract the final order of the roster batting lineup
    //       and restrict the ordering to MMF or MMMF if optioned
    // TODO: fix submit button and its actions

    let CreateGameComponent = (<LoadingOverlay />)
    let BattingOrderComponent = (<LoadingOverlay />)

    if (createGame.leagues && createGame.teams && createGame.diamonds) {
      CreateGameComponent = (
        <CreateGame
          submitCreateGameForm={submitCreateFormQuery}
          leagueOptions={createGame.leagues}
          teamsOptions={createGame.teams}
          labelHomeOrAway={game.homeOrAway}
          diamondOptions={createGame.diamonds}
          dateRange={dateRange}
          handleFormChange={updateCreateFormQuery} />)
    }

    if (createGame.batters) {
      BattingOrderComponent = (<SortableUnorderedList id="battingOrderList" ref="battingOrderList" items={createGame.batters} onChange={handleBattingOrder} />)
    }

    return (
      <div className="create-game-container">
        <Segment>
          {CreateGameComponent}
        </Segment>
        <Segment>
          <Header as="h3">Fielding Lineup</Header>
          <GenericCelledTable header={header} body={body} footer={footer} />
        </Segment>
        <Segment>
          <Header as="h3">Batting Order</Header>
          {BattingOrderComponent}
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
      createGame: state.createGame,
      game: state.game
    }
  },
  function mapDispatchToProps (dispatch, ownProps) {
    return {
      init () {
        dispatch(createGameFormWithDefaults())
        dispatch({ type: 'create-game.form/init' })
      },
      populateOptions (type, options) {
        dispatch({ type: 'create-game.form/populate-options', payload: { type: type, options: options } })
      },
      toggleInningLock (event, data) {
        dispatch({ type: 'create-game.lock-inning/toggle', payload: { inning: data.data } })
      },
      updateAvailableLeagues (leagues) {
        dispatch(updateAvailableLeagues(leagues))
      },
      updateAvailableTeams (teams) {
        dispatch(updateAvailableTeams(teams))
      },
      updateAvailableRoster (roster) {
        dispatch(updateAvailableRoster(roster))
      },
      handleRosterOptions (event, data) {
        dispatch(updateLineups(event, data))
      },
      handleBattingOrder (newOrder) {
        dispatch({ type: 'create-game.batting-order/change', payload: { newOrder: newOrder } })
      },
      clearFielderRow (event, data) {
        dispatch({ type: 'create-game.fielder-row/clear', payload: { position: data.data } })
      },
      clearFielderInning (event, data) {
        dispatch({ type: 'create-game.fielder-inning/clear', payload: { inning: data.data } })
      },
      clearFielderAll (event, data) {
        // TODO: Prompt user before erasing all
        dispatch({ type: 'create-game.fielder-all/clear' })
      },
      autoFillFielders (event, data) {
        // TODO: Prompt user for strategy to auto-fill
        dispatch(autoFillFieldingLineup())
      },
      updateCreateFormQuery (event, data) {
        dispatch(updateGameForm(event, data))
      },
      submitCreateFormQuery (event, data) {
        event.preventDefault()
        dispatch(submitGameForm(event, data))
      },
      destroy () {
        dispatch({ type: 'route.game-container/destroy' })
        dispatch({ type: 'create-game.form/destroy' })
      }
    }
  }
)(CreateGameContainer))

CreateGameContainer.defaultProps = {
  sortable: null
}
