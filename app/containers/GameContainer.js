import React, { Component } from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router'

import { loadGame, saveGame } from '@track/actions/game-actions'
import Game from '@track/components/Game'
import LoadingOverlay from '@track/components/LoadingOverlay'

class GameContainer extends Component {
  componentWillMount () {
    this.props.loadGame(this.props.gameId)
  }
  componentWillUnmount () {
    this.props.destroy()
  }
  render () {
    const { game, saveGame, advanceBatterRunner, onScoresheetChange, toggleInningLock } = this.props

    if (!game) {
      return <LoadingOverlay msg={"Loading Game..."} />
    }

    if (!game._id || !game.league) {
      return <LoadingOverlay msg={"Loading Game Details..."} />
    }

    if (!game.league.innings) {
      return <LoadingOverlay msg={"Loading Game State..."} />
    }

    return (
      <Game
        id={game._id}
        innings={game.league.innings}
        currentInning={game.currentInning}
        mercyRuns={game.league.mercyRuns}
        noMercyInningBegin={game.league.noMercyInningBegin}
        positions={game.league.positions}
        fielding={game.ourFieldingLineup}
        battingOrder={game.ourBattingOrder}
        statusGrid={game.statusGrid}
        scoresheet={game.scoresheet}
        advanceRunner={advanceBatterRunner}
        onScoresheetChange={onScoresheetChange}
        toggleInningLock={toggleInningLock}
        saveGame={saveGame} />
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
      onScoresheetChange (event, data) {
        dispatch({ type: 'game.scoresheet/update', payload: { target: event.target, data: data } })
      },
      toggleInningLock (event, data) {
        dispatch({ type: 'game.lock-inning/toggle', payload: { inning: data.data } })
        dispatch(saveGame())
      },
      saveGame () {
        dispatch(saveGame())
      },
      destroy () {
        dispatch({ type: 'route.game-container/destroy' })
      }
    }
  }
)(GameContainer))
