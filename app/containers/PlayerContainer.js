import React, { Component } from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router'

class PlayerContainer extends Component {
  componentWillMount () {
    const { init } = this.props
    init(playerId)
  }
  componentWillReceiveProps (nextProps) {
    const thisId = this.props.playerId
    const nextId = nextProps.playerId
    if (thisId !== nextId) {
      this.props.destroy()
      this.props.init(nextId)
    }
  }
  componentWillUnmount () {
    this.props.destroy()
  }
  render () {
    const { player } = this.props
    if (!player || !player.id) {
      return <div>No Player</div>
    }
    return (<div>This will be player {player.id} Component</div>)
  }
}
export default withRouter(connect(
  function mapStateToProps (state, ownProps) {
    return {
      player: state.entities.players.current
    }
  },
  function mapDispatchToProps (dispatch, ownProps) {
    return {
      init (id) {
        dispatch({
          type: 'route.player-container/init',
          payload: {}
        })
        dispatch(fetchPlayer(id)).catch(function (reason) {
          dispatch({
            type: 'route.player-container.fetchTeam/error',
            payload: reason
          })
          // dispatch(pushLocation('/'))
        })
      },
      destroy () {
        dispatch({
          type: 'route.player-container/destroy',
          payload: {}
        })
        dispatch({
          type: 'player/destroy',
          payload: {}
        })
      }
    }
  }
)(PlayerContainer))
