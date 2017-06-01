import React, { Component } from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router'

import { loadGame } from '@track/actions/game-actions'
import Game from '@track/components/Game'

class GameContainer extends Component {
  componentWillMount () {
    const { init, game } = this.props
    if (!game.gameId) {
      this.props.loadGame()
    }
  }
  componentWillUnmount () {
    this.props.destroy()
  }
  render () {
    const { game } = this.props
    if (!game || isNaN(game.gameId) || game.gameId === null) {
      return <div>Loading Game...</div>
    }

    let rosterOne = [
      {
        id: 0,
        name: 'Sinto Ling',
        jersey: 52
      },
      {
        id: 1,
        name: 'Bryan Ling',
        jersey: 98
      },
      {
        id: 2,
        name: 'Chris Lo',
        jersey: 6
      },
      {
        id: 3,
        name: 'Thomas Lo',
        jersey: '00'
      }
    ]

    return (
      <Game id={game.gameId} innings={game.innings} roster={rosterOne} />
    )
  }
}
export default withRouter(connect(
  function mapStateToProps (state, ownProps) {
    return {
      game: state.game
    }
  },
  function mapDispatchToProps (dispatch, ownProps) {
    return {
      loadGame () {
        // CR: Clear out old game first?
        dispatch(loadGame())
      },
      // createGame (gameId) {
      //   // CR: Clear out old game first?
      //   dispatch({ type: 'route.game-container/new-game', payload: { gameId: gameId }})
      //   createGame(gameId)
      // },
      // initGame (id) {
      //   dispatch({ type: 'route.team-container/init', payload: { id: id } })
      //   fetchGame(id)
      // },
      destroy () {
        dispatch({ type: 'route.game-container/destroy' })
      }
    }
  }
)(GameContainer))
