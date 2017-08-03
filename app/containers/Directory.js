import React, { Component } from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router'
import { Header, Button } from 'semantic-ui-react'
import { push as pushLocation } from 'react-router-redux'

import LoadingOverlay from '@track/components/LoadingOverlay'
// import CreationModalForm from '@track/components/CreationModalForm'
import CreateTeamContainer from '@track/containers/Create/CreateTeamContainer'
import CreatePlayerContainer from '@track/containers/Create/CreatePlayerContainer'
import CardGrid from '@track/components/CardGrid'
import Segue from '@track/components/Segue'
import { updateCreateForm, submitCreateForm } from '@track/actions/directory-actions'
import { objectToOption, mapLeaguesIntoTeams, mapTeamsIntoPlayers } from '@track/utils'

class Directory extends Component {
  componentWillUnmount () {
    this.props.destroy()
  }
  render () {
    const { type, directory, team, player, goToCreateGame, goToGame, toggleCreateForm, updateCreateFormQuery, submitCreateFormQuery } = this.props

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
    let form
    let exhibit = (<div />)
    if (type === 'teams') {
      creation = (<div><Button secondary onClick={toggleCreateForm}>Create Team</Button></div>)
      if (directory.showCreateForm) {
        form = (
          <CreateTeamContainer
            captainOptions={captainOptions}
            playerOptions={playerOptions}
            leagueOptions={leagueOptions}
            formChangeHandler={updateCreateFormQuery}
            formSubmissionHandler={submitCreateFormQuery} />
        )
      }
      exhibit = <CardGrid collection={mapLeaguesIntoTeams(Object.assign([], directory[type]), Object.assign([], directory.leagues))} type={type} />
    }
    if (type === 'players') {
      creation = (<div><Button onClick={toggleCreateForm}>Create Player</Button></div>)
      if (directory.showCreateForm) {
        form = (
          <CreatePlayerContainer
            teamOptions={teamOptions}
            gender={player.gender}
            formChangeHandler={updateCreateFormQuery}
            formSubmissionHandler={submitCreateFormQuery} />
        )
      }
      exhibit = <CardGrid collection={mapTeamsIntoPlayers(Object.assign([], directory[type]), Object.assign([], directory.teams))} type={type} />
    }

    if (type === 'games') {
      exhibit = <Segue children={directory[type]} teams={directory.teams} goToGame={goToGame} />
    }

    return (
      <div>
        <Header as="h3">{type.toUpperCase()}</Header>
        { creation }
        { form }
        { exhibit }
      </div>
    )
  }
}
export default withRouter(connect(
  function mapStateToProps (state, ownProps) {
    return {
      directory: state.directory,
      team: state.team,
      player: state.player
    }
  },
  function mapDispatchToProps (dispatch, ownProps) {
    return {
      toggleCreateForm () {
        dispatch({ type: 'route.directory-list/toggle-create-form' })
      },
      updateCreateFormQuery (event, data) {
        dispatch(updateCreateForm(ownProps.type, event, data))
        // dispatch({ type: 'route.directory-list/update-form-query', payload: { type: ownProps.type, field: data['data-create-id'], value: data.value } })
      },
      submitCreateFormQuery (event, data) {
        event.preventDefault()
        dispatch({ type: 'route.directory-list/submit-form-query', payload: { id: event.target.id } })
        dispatch(submitCreateForm(event.target.id))
        dispatch({ type: 'route.directory-list/toggle-create-form' })
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
