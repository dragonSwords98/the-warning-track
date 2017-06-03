import React, { Component } from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router'

import LoadingOverlay from '@track/components/LoadingOverlay'
import CreationModalForm from '@track/components/CreationModalForm'
import CardGrid from '@track/components/CardGrid'
import { Header } from 'semantic-ui-react'
import CreatePlayer from '@track/components/Form/CreatePlayer'


import { fetchDirectory } from '@track/actions/directory-actions'

class Directory extends Component {
  componentWillReceiveProps (nextProps) {
    if (!this.props.directory[nextProps.type]) {
      this.props.fetch(nextProps.type)
    }
  }
  componentWillMount () {
    // const { init, type } = this.props
    // init()
  }
  componentWillUnmount () {
    this.props.destroy()
  }
  render () {
    const { type, directory } = this.props
    if (!directory[type]) {
      return (<LoadingOverlay />)
    }


    let leagueOptions = [
      { key: 'ccsa', value: 'ccsa', text: 'CCSA' },
      { key: 'sssl', value: 'sssl', text: 'SSSL' },
      { key: 'snsp', value: 'snsp', text: 'SNSP' },
      { key: 'nl', value: 'nl', text: 'Nations League' }
    ]
    let playerOptions = [], teamOptions = []
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

    return (
      <div>
        <Header as='h3'>{type.toUpperCase()}</Header>
        <CreatePlayer teamOptions={teamOptions} />
        <CreationModalForm type={type} teamOptions={teamOptions} playerOptions={playerOptions} leagueOptions={leagueOptions} />
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
      fetch(type) {
        dispatch({ type: 'route.directory-list/fetch' })
        dispatch(fetchDirectory('players'))
        dispatch(fetchDirectory('teams'))
      },
      destroy() {
        dispatch({ type: 'route.directory-list/destroy' })
      }
    }
  }
)(Directory))
