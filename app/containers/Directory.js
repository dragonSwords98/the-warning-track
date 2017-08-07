import React, { Component } from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router'
import { Header, Button } from 'semantic-ui-react'
import { push as pushLocation } from 'react-router-redux'

import LoadingOverlay from '@track/components/LoadingOverlay'
// import CreationModalForm from '@track/components/CreationModalForm'
import CreateTeam from '@track/components/Form/CreateTeam'
import CreatePlayerContainer from '@track/containers/Create/CreatePlayerContainer'
import CardGrid from '@track/components/CardGrid'
import Segue from '@track/components/Segue'
import { updateCreateTeamForm, submitCreateTeamForm } from '@track/actions/form/team'
import { updateCreateForm, validateCreateForm } from '@track/actions/directory-actions'
import { objectToOption, mapLeaguesIntoTeams, mapTeamsIntoPlayers } from '@track/utils'

class Directory extends Component {
  componentWillUnmount () {
    this.props.destroy()
  }
  render () {
    const {
      type,
      teamForm,
      navigation,
      directory,
      team,
      player,
      goToCreateGame,
      goToGame,
      toggleCreateForm,
      updateCreateFormQuery,
      updateCreateTeamForm,
      validateAndSubmitTeamForm,
      validateAndSubmitCreateFormQuery } = this.props

    if (!directory || !directory.players || !directory.teams || !directory.games || !directory.leagues) {
      // CR: TrackApp now loads directories on init and will not mount child components until it receives this data. So this should be at best an ERROR case
      return (<LoadingOverlay msg={ "Loading Directories..." } />)
    }

    let playerOptions = []
    let teamOptions = []
    let leagueOptions = []
    let rosterOptions = []
    let captainOptions = []
    if (directory.players) {
      playerOptions = objectToOption(directory.players)
    }
    if (directory.teams) {
      teamOptions = objectToOption(directory.teams)
    }
    if (directory.leagues) {
      leagueOptions = objectToOption(directory.leagues)
    }
    if (team.roster) {
      rosterOptions = directory.players.filter(p => team.roster.includes(p._id))
      captainOptions = objectToOption(rosterOptions)
    }

    let creation = (<div><Button primary onClick={goToCreateGame}>Create Game</Button></div>)
    let formComponent, filter
    let exhibit = (<div />)
    if (type === 'teams') {
      creation = (<div><Button secondary onClick={toggleCreateForm}>Create Team</Button></div>)
      if (directory.showCreateForm) {
        formComponent = (
          <CreateTeam
            team={team}
            captainOptions={captainOptions}
            playerOptions={playerOptions}
            leagueOptions={leagueOptions}
            formChangeHandler={updateCreateTeamForm}
            formSubmissionHandler={validateAndSubmitTeamForm}
            fieldErrors={teamForm.invalidFields} />
        )
      }
      exhibit = <CardGrid collection={mapLeaguesIntoTeams(Object.assign([], directory[type]), Object.assign([], directory.leagues))} filter={navigation.selectedOption} type={type} />
    }
    if (type === 'players') {
      creation = (<div><Button onClick={toggleCreateForm}>Create Player</Button></div>)
      if (directory.showCreateForm) {
        formComponent = (
          <CreatePlayerContainer
            teamOptions={teamOptions}
            gender={player.gender}
            formChangeHandler={updateCreateFormQuery}
            formSubmissionHandler={validateAndSubmitCreateFormQuery} />
        )
      }
      exhibit = <CardGrid collection={mapTeamsIntoPlayers(Object.assign([], directory[type]), Object.assign([], directory.teams))} filter={navigation.selectedOption} type={type} />
    }

    if (type === 'games') {
      exhibit = <Segue children={directory[type]} teams={directory.teams} filter={navigation.selectedOption} goToGame={goToGame} />
    }

    return (
      <div>
        <Header as="h3">{type.toUpperCase()}</Header>
        { creation }
        { formComponent }
        { exhibit }
      </div>
    )
  }
}
export default withRouter(connect(
  function mapStateToProps (state, ownProps) {
    return {
      navigation: state.navigation,
      directory: state.directory,
      team: state.team,
      player: state.player,
      teamForm: state.teamForm
    }
  },
  function mapDispatchToProps (dispatch, ownProps) {
    return {
      toggleCreateForm () {
        dispatch({ type: 'route.directory-list/toggle-create-form' })
      },
      updateCreateTeamForm  (event, data) {
        dispatch(updateCreateTeamForm(ownProps.type, event, data))
      },
      updateCreateFormQuery (event, data) {
        dispatch(updateCreateForm(ownProps.type, event, data))
        // dispatch({ type: 'route.directory-list/update-form-query', payload: { type: ownProps.type, field: data['data-create-id'], value: data.value } })
      },
      validateAndSubmitTeamForm (event, data) {
        event.preventDefault()
        dispatch(submitCreateTeamForm(event.target.id))
      },
      validateAndSubmitCreateFormQuery (event, data) {
        event.preventDefault()
        dispatch(validateCreateForm(event.target.id))
      },
      goToCreateGame () {
        dispatch(pushLocation('/games/create'))
      },
      goToGame (event, data) {
        dispatch(pushLocation('/games/' + data['data-game-id']))
      },
      destroy () {
        dispatch({ type: 'directory.create-form/destroy' })
      }
    }
  }
)(Directory))
