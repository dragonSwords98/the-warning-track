import React, { Component } from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router'

import { loadGame } from '@track/actions/game-actions'
import Game from '@track/components/Game'

class GameContainer extends Component {
  componentWillMount () {
    this.props.loadGame(this.props.gameId)
  }
  componentWillUnmount () {
    this.props.destroy()
  }
  render () {
    const { game } = this.props
    console.log(this.props.gameId, game)
    if (!game) {
      return <div>Loading Game...</div>
    }

    if (!game._id || !game.league) {
      return <div>Loading Game Details...</div>
    }

    if (!game.league.innings) {
      return <div>Loading Game State...</div>
    }

    // strict order ( CR, 1B, 2B, SS, 3B, LF, CF, RF, LR, RR )
    // TODO: game.ourFieldingLineup for fills on specific innings, currently assumes fielding lineup never changes
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
      game: state.game
    }
  },
  function mapDispatchToProps (dispatch, ownProps) {
    return {
      loadGame (gameId) {
        dispatch(loadGame(gameId))
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
