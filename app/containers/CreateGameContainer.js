import React, { Component } from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router'

import moment from 'moment'
import { Message, Label, Icon, Confirm, Segment, Table, Header, Button } from 'semantic-ui-react'

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
  clearFielderRow,
  clearFielderInning,
  clearFieldingLineup,
  updateBattingOrder,
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
  constructor (...args) {
    super(...args)
    this.initiateBattingOrder = this.initiateBattingOrder.bind(this)
  }

  initiateBattingOrder () {
    const el = document.getElementById('battingOrderList')
    if (!this.props.sortable && el) {
      this.setState((prevState, props) => {
        return {
          sortable: Sortable.create(el, {
            onUpdate: evt => {
              let newOrder = []
              Array.prototype.forEach.call(evt.target.children, function (el, i) {
                newOrder.push([el.getAttribute('data-id'), parseInt(el.getAttribute('data-gender'))])
              })
              this.props.handleBattingOrder(newOrder)
            }
          })
        }
      })
      if (!this.props.game.ourBattingOrder.length) {
        this.props.handleBattingOrder(this.props.createGame.batters)
      }
    }
  }

  componentWillMount () {
    this.props.init()
  }

  componentWillUnmount () {
    this.props.destroy()
  }

  componentDidUpdate (prevProps, prevState) {
    if (prevProps.createGame.batters !== this.props.createGame.batters) {
      this.initiateBattingOrder()
    }
  }

  // TODO: HIGHLY RECOMMEND WE THROW THIS OUT
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
      autoFillFielders,
      handlePromptClearCancel,
      handlePromptClearConfirm
    } = this.props
    if (!game || !createGame ||
      !directory.players ||
      !directory.teams ||
      !directory.games ||
      !directory.leagues ||
      !directory.diamonds) {
      return (<LoadingOverlay msg={'Loading Game Creator...'} />)
    }

    let header = [(<Table.HeaderCell key='header-innings-0'>Please select a league</Table.HeaderCell>)]
    let body = []
    let footer = []
    if (game.league) {
      header = [
        <Table.HeaderCell key={'header-innings-0'}>
            <Button circular icon='rocket' onClick={autoFillFielders} />
            <Button circular icon='bomb' disabled={createGame.invalidFields.ourFieldingLineupIsEmpty} onClick={clearFielderAll} />
            <Icon
              circular color={createGame.invalidFields.ourFieldingLineupIsNotFull ? 'red' : 'green'}
              name={createGame.invalidFields.ourFieldingLineupIsNotFull ? 'dont' : 'checkmark'} />
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
            lineup={game.ourFieldingLineup}
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

    // let isFormIncomplete = validateForm(game)
    // TODO: Add a tally table
    // TODO: find a way to extract the final order of the roster batting lineup
    //       and restrict the ordering to MMF or MMMF if optioned
    // TODO: fix submit button and its actions

    let CreateGameComponent = (<LoadingOverlay />)
    let BattingOrderComponent = (<Segment>Please select a team</Segment>)
    let BattingOrderRule = ''

    if (createGame.leagues && createGame.teams && createGame.diamonds) {
      CreateGameComponent = (
        <CreateGame
          game={game}
          invalidFields={createGame.invalidFields}
          submitCreateGameForm={submitCreateFormQuery}
          leagueOptions={createGame.leagues}
          teamsOptions={createGame.teams}
          labelHomeOrAway={game.homeOrAway}
          diamondOptions={createGame.diamonds}
          dateRange={dateRange}
          handleFormChange={updateCreateFormQuery} />)
    }

    if (createGame.batters && game.ourTeam) {
      BattingOrderComponent = (<SortableUnorderedList id="battingOrderList" ref="battingOrderList" items={createGame.batters} onChange={handleBattingOrder} />)
    }

    // CR: If you have a createGame.invalidFields.illegalMinimalRoster, why also have a leagueRosterConditional... this is a redundency
    let leagueRosterConditional = true
    if (game.league) {
      leagueRosterConditional = createGame.roster.length >= game.league.positions.length
      BattingOrderRule = <Label>Coed Rule: {game.league.coedRule}</Label>
    }

    // TODO: the GenericCelledTable events should trigger validate too! if fieldingLineup continues an empty/null/undefined field, valid:false
    return (
      <div className="create-game-container">
        <Segment>
          <Message color='red' hidden={leagueRosterConditional && !createGame.invalidFields.illegalMinimalRoster}>
            WARNING: There are not enough players on the current roster to field a team
          </Message>
          {CreateGameComponent}
        </Segment>
        <Segment>
          <Header as="h3">Fielding Lineup</Header>
          <GenericCelledTable header={header} body={body} footer={footer} />
          <Confirm
            open={createGame.promptClear}
            content='Are you sure you want to clear your fielding lineup? This action is irreversible.'
            onCancel={handlePromptClearCancel}
            onConfirm={handlePromptClearConfirm}
          />
        </Segment>
        <Segment>
          <Header as="h3">Batting Order
            <Icon
              name={createGame.invalidFields.illegalBattingOrder ? 'exclamation triangle' : 'check circle' }
              color={createGame.invalidFields.illegalBattingOrder ? 'red' : 'green' } />
          </Header>
          {BattingOrderRule}
          {BattingOrderComponent}
        </Segment>
        <Segment>
          <Button type="submit" form="createGameForm" disabled={!createGame.valid}>Submit</Button>
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
        dispatch(updateBattingOrder(newOrder))
      },
      clearFielderRow (event, data) {
        dispatch(clearFielderRow(data))
      },
      clearFielderInning (event, data) {
        dispatch(clearFielderInning(data))
      },
      clearFielderAll (event, data) {
        // TODO: Prompt user before erasing all
        dispatch({ type: 'create-game.fielder-all/open-clear-prompt' })
      },
      handlePromptClearCancel (event, data) {
        dispatch({ type: 'create-game.fielder-all/close-clear-prompt' })
      },
      handlePromptClearConfirm (event, data) {
        dispatch(clearFieldingLineup())
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
