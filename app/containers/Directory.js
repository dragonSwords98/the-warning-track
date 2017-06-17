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
import { fetchDirectory, submitCreateForm } from '@track/actions/directory-actions'
import { populateOptions } from '@track/utils'

class Directory extends Component {
  componentWillReceiveProps (nextProps) {
    // if (!this.props.directory[nextProps.type]) {
    //   this.props.fetch(nextProps.type)
    // }
  }
  componentWillMount () {
    // const { init, type } = this.props
    // this.props.fetch()
  }
  componentWillUnmount () {
    this.props.destroy()
  }
  render () {
    const { type, directory, goToCreateGame, goToGame, toggleCreateForm, updateCreateFormQuery, submitCreateFormQuery } = this.props
    // if (!directory[type]) {
    if (!directory || !directory.players || !directory.teams || !directory.games || !directory.leagues) {
      return (<LoadingOverlay />)
    }

    let playerOptions = [], teamOptions = [], gameOptions = [], leagueOptions = []
    if (directory.players) {
      playerOptions = populateOptions(directory.players)
    }
    if (directory.teams) {
      teamOptions = populateOptions(directory.teams)
    }
    if (directory.games) {
      gameOptions = populateOptions(directory.games)
    }
    if (directory.leagues) {
      leagueOptions = populateOptions(directory.leagues)
    }

    let creation = (<div><Button primary onClick={goToCreateGame}>Create Game</Button></div>)
    let form, exhibit = <div></div>
    if (type === 'teams') {
      creation = (<div><Button secondary onClick={toggleCreateForm}>Create Team</Button></div>)
      if (directory.showCreateForm) {
        form = (
          <CreateTeamContainer
            playerOptions={playerOptions}
            leagueOptions={leagueOptions}
            formChangeHandler={updateCreateFormQuery}
            formSubmissionHandler={submitCreateFormQuery} />
        )
      }
      exhibit = <CardGrid collection={directory[type]} type={type} />
    }
    if (type === 'players') {
      creation = (<div><Button onClick={toggleCreateForm}>Create Player</Button></div>)
      if (directory.showCreateForm) {
        form = (
          <CreatePlayerContainer
            teamOptions={teamOptions}
            formChangeHandler={updateCreateFormQuery}
            formSubmissionHandler={submitCreateFormQuery} />
        )
      }
      exhibit = <CardGrid collection={directory[type]} type={type} />
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
      directory: state.directory
    }
  },
  function mapDispatchToProps (dispatch, ownProps) {
    return {
      // init() {
      //   dispatch({ type: 'route.directory-list/init' })
      // },
      fetch (type) {
        // dispatch({ type: 'route.directory-list/fetch' })
        // dispatch(fetchDirectory('players'))
        // dispatch(fetchDirectory('teams'))
        // dispatch(fetchDirectory('games'))
        // dispatch(fetchDirectory('leagues'))
        // dispatch(fetchDirectory('diamonds'))
      },
      toggleCreateForm () {
        dispatch({ type: 'route.directory-list/toggle-create-form' })
      },
      updateCreateFormQuery (event, data) {
        dispatch({ type: 'route.directory-list/update-form-query', payload: { type: ownProps.type, field: data['data-create-id'], value: data.value } })
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
