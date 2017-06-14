import React, { Component } from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router'

import { loadGame, startGame } from '@track/actions/game-actions'
import { fetchDirectory } from '@track/actions/directory-actions' // CR: looks like it don't belong as a 'directory' state
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
    const { game, directory } = this.props
    if (!game || isNaN(game.gameId) || game.gameId === null || !directory.players) {
      return <div>Loading Game...</div>
    }

    const DISABLED = 'disabled'
    const OUT_STATUS = {
      name: 'OUT',
      label: 'Out',
      color: 'black'
    }
    const IN_THE_HOLE_STATUS = {
      name: 'IN_THE_HOLE',
      label: 'Hole',
      color: 'yellow'
    }

    // strict order ( CR, 1B, 2B, SS, 3B, LF, CF, RF, LR, RR )
    let inningFielding = directory.players
    let gameFielding = new Array(game.innings).fill(inningFielding)
    console.log(gameFielding)

  // lineup: null // structure should be array of object => e.g.
  // [ ['bl98', 'sl52', 'cl6', ...], [...], ...],

    return (
      <Game
        id={game.gameId}
        innings={game.innings}
        mercyRuns={game.mercyRuns}
        noMercyInningBegin={game.noMercyInningBegin}
        positions={game.positions}
        fielding={gameFielding}
        roster={directory.players}
        statusGrid={game.statusGrid}
        lockedInnings={game.lockedInnings}
        advanceRunner={this.props.advanceBatterRunner}
        toggleInningLock={this.props.toggleInningLock} />
    )
  }
}
export default withRouter(connect(
  function mapStateToProps (state, ownProps) {
    return {
      game: state.game,
      directory: state.directory
    }
  },
  function mapDispatchToProps (dispatch, ownProps) {
    return {
      loadGame () {
        // CR: Clear out old game first?
        // dispatch(fetchDirectory('players'))
        // dispatch(loadGame())
        dispatch(startGame())
      },
      advanceBatterRunner (event, data) {
        dispatch({ type: 'game.advance-runner/advance', payload: { target: event.target, data: data }})
      },
      toggleInningLock (event, data) {
        dispatch({ type: 'game.lock-inning/toggle', payload: { inning: data.data }})
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
