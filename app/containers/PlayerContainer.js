import React, { Component } from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router'

import { fetchPlayer } from '@track/actions/player-actions'

class PlayerContainer extends Component {
  componentWillMount () {
    const { init, playerId } = this.props
    init(playerId)
  }
  componentWillUnmount () {
    this.props.destroy()
  }
  render () {
    const { player, playerId, playerName } = this.props
    if (!player || !playerId || !playerName) {
      return <div>No Such Player</div>
    }
    return (<div><h1>{playerName}</h1></div>)
  }
}
export default withRouter(connect(
  function mapStateToProps (state, ownProps) {
    return {
      player: state.player
    }
  },
  function mapDispatchToProps (dispatch, ownProps) {
    return {
      init (id) {
        dispatch(fetchPlayer(id))
      },
      destroy () {
        dispatch({ type: 'route.player-container/destroy' })
      }
    }
  }
)(PlayerContainer))
