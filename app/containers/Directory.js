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
import { fetchDirectory, submitCreateForm } from '@track/actions/directory-actions'

class Directory extends Component {
  componentWillReceiveProps (nextProps) {
    // if (!this.props.directory[nextProps.type]) {
    //   this.props.fetch(nextProps.type)
    // }
  }
  componentWillMount () {
    // const { init, type } = this.props
    this.props.fetch()
  }
  componentWillUnmount () {
    this.props.destroy()
  }
  render () {
    const { type, directory, goToCreateGame, toggleCreateForm, updateCreateFormQuery, submitCreateFormQuery } = this.props
    // if (!directory[type]) {
    if (!directory || !directory.players || !directory.teams || !directory.games) {
      return (<LoadingOverlay />)
    }

    let leagueOptions = [
      { key: 'ccsa', value: 'ccsa', text: 'CCSA' },
      { key: 'sssl', value: 'sssl', text: 'SSSL' },
      { key: 'snsp', value: 'snsp', text: 'SNSP' },
      { key: 'nl', value: 'nl', text: 'Nations League' }
    ]
    let playerOptions = [], teamOptions = [], gameOptions = []
    if (directory.players) {
      playerOptions = directory.players.map((player) => {
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
    if (directory.games) {
      gameOptions = directory.games.map((game) => {
        return {
          key: game._id,
          value: game._id,
          text: game.name
        }
      })
    }

    let creation = (<div><Button primary onClick={goToCreateGame}>Create Game</Button></div>)
    let form
    if (type === 'teams') {
      creation = (<div><Button secondary onClick={toggleCreateForm}>Create Team</Button></div>)
      if (directory.showCreateForm) {
        form = (<CreateTeamContainer
                  playerOptions={playerOptions}
                  leagueOptions={leagueOptions}
                  formChangeHandler={updateCreateFormQuery}
                  formSubmissionHandler={submitCreateFormQuery}
                  />)
      }
    }
    if (type === 'players') {
      creation = (<div><Button onClick={toggleCreateForm}>Create Player</Button></div>)
      if (directory.showCreateForm) {
        form = (<CreatePlayerContainer
                  teamOptions={teamOptions}
                  formChangeHandler={updateCreateFormQuery}
                  formSubmissionHandler={submitCreateFormQuery}
                  />)
      }
    }

      // creation = <CreationModalForm type={type}
      //             teamOptions={teamOptions}
      //             playerOptions={playerOptions}
      //             leagueOptions={leagueOptions}
      //             formChangeHandler={this.props.updateCreateFormQuery}
      //             formSubmissionHandler={this.props.submitCreateFormQuery}
      //             />
    return (
      <div>
        <Header as='h3'>{type.toUpperCase()}</Header>
        { creation }
        { form }
        <CardGrid collection={directory[type]} type={type} />
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
        dispatch({ type: 'route.directory-list/fetch' })
        dispatch(fetchDirectory('players'))
        dispatch(fetchDirectory('teams'))
        dispatch(fetchDirectory('games'))
      },
      toggleCreateForm() {
        dispatch({ type: 'route.directory-list/toggle-create-form' })
      },
      updateCreateFormQuery(event, data) {
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
      destroy () {
        dispatch({ type: 'route.directory-list/destroy' })
      }
    }
  }
)(Directory))
