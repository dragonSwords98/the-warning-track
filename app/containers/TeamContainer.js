import React, { Component } from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router'

import { fetchTeam } from '@track/actions/team-actions'

class TeamContainer extends Component {
  componentWillMount () {
    const { init, teamId } = this.props
    // trackType="team" trackId={teamId} teamName={match.params.teamName}
    init(teamId)
  }
  componentWillUnmount () {
    this.props.destroy()
  }
  render () {
    const { teamId, teamName } = this.props
    // if (!team || team.id !== teamId) {
    return (
      <div>This will be Team {teamId}: {teamName}</div>
    )
    // }
    // return children
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
        dispatch({ type: 'route.team-container/init', payload: { id: id } })
        fetchTeam(id)
      },
      destroy () {
        dispatch({ type: 'route.team-container/destroy' })
      }
    }
  }
)(TeamContainer))
