import React, { Component } from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router'

import { loadGame, startGame } from '@track/actions/game-actions'
import { fetchDirectory } from '@track/actions/directory-actions' // CR: looks like it don't belong as a 'directory' state
import Game from '@track/components/Game'

class GameContainer extends Component {
  componentWillMount () {
    // const { game, gameId } = this.props
    // if (!game._id || !gameId) {
      this.props.loadGame(this.props.gameId)
    // }
  }
  componentWillUnmount () {
    this.props.destroy()
  }
  render () {
    const { game, directory } = this.props
    console.log(this.props.gameId, game)
    if (!game || !game._id) {
      return <div>Loading Game...</div>
    }

    // strict order ( CR, 1B, 2B, SS, 3B, LF, CF, RF, LR, RR )
    //TODO: game.ourFieldingLineup
    let inningFielding = game.ourFieldingLineup
    let gameFielding = new Array(game.league.innings).fill(inningFielding)

    return (
      <Game
        id={game._id}
        innings={game.league.innings}
        mercyRuns={game.league.mercyRuns}
        noMercyInningBegin={game.league.noMercyInningBegin}
        positions={game.league.positions}
        fielding={gameFielding}
        battingOrder={game.ourBattingOrder}
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
      loadGame (gameId) {
        dispatch(startGame(gameId))
      },
      advanceBatterRunner (event, data) {
        dispatch({ type: 'game.advance-runner/advance', payload: { target: event.target, data: data } })
      },
      toggleInningLock (event, data) {
        dispatch({ type: 'game.lock-inning/toggle', payload: { inning: data.data } })
      },
      destroy () {
        dispatch({ type: 'route.game-container/destroy' })
      }
    }
  }
)(GameContainer))
