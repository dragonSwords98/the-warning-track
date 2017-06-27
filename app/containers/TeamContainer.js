import React, { Component } from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router'

import { fetchTeam } from '@track/actions/team-actions'

class TeamContainer extends Component {
  componentWillMount () {
    const { init, teamId } = this.props
    init(teamId)
  }
  componentWillUnmount () {
    this.props.destroy()
  }
  render () {
    const { team, teamId, teamName } = this.props
    if (!team || !teamId || !teamName) {
      return <div>No Such Team</div>
    }
    return (<div><h1>{teamName}</h1></div>)
  }
}
export default withRouter(connect(
  function mapStateToProps (state, ownProps) {
    return {
      team: state.team
    }
  },
  function mapDispatchToProps (dispatch, ownProps) {
    return {
      init (id) {
        dispatch(fetchTeam(id))
      },
      destroy () {
        dispatch({ type: 'route.team-container/destroy' })
      }
    }
  }
)(TeamContainer))
