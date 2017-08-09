import React, { Component } from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router'
import { Tab } from 'semantic-ui-react'

import { loadGame, saveGame } from '@track/actions/game-actions'
import Game from '@track/components/Game'
import OpponentOffenseTable from '@track/components/Game/OpponentOffenseTable'
import LoadingOverlay from '@track/components/LoadingOverlay'

class GameContainer extends Component {
  componentWillMount () {
    this.props.loadGame(this.props.gameId)
  }
  componentWillUnmount () {
    this.props.destroy()
  }
  render () {
    const { game, saveGame, advanceBatterRunner, changeHitType, onScoresheetChange, toggleInningLock, onChangeOpposingBattersCount } = this.props

    if (!game) {
      return <LoadingOverlay msg={"Loading Game..."} />
    }

    if (!game._id || !game.league) {
      return <LoadingOverlay msg={"Loading Game Details..."} />
    }

    if (!game.league.innings) {
      return <LoadingOverlay msg={"Loading Game State..."} />
    }

    const OurTeamComponent = <Game
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
      changeHitType={changeHitType}
      onScoresheetChange={onScoresheetChange}
      toggleInningLock={toggleInningLock}
      saveGame={saveGame} />

    const OpponentComponent = <OpponentOffenseTable
      innings={game.league.innings}
      opposingBattingOrder={game.opposingBattingOrder}
      onChangeOpposingBattersCount={onChangeOpposingBattersCount}
    />

    const panes = [
      { menuItem: game.ourTeam.name, render: () => <Tab.Pane attached={false}>{ OurTeamComponent }</Tab.Pane> },
      { menuItem: game.opposingTeam, render: () => <Tab.Pane attached={false}>{ OpponentComponent }</Tab.Pane> }
    ]
    const GameMenu = <Tab menu={{ secondary: true, pointing: true }} panes={panes} onTabChange={saveGame} />

    return (
      <div>
        { GameMenu }
      </div>
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
      changeHitType (event, data) {
        dispatch({ type: 'game.hit/change-type', payload: { target: event.target, data: data } })
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
      onChangeOpposingBattersCount (event, data) {
        dispatch({ type: 'game.opponent/set-number-of-batters', payload: { increment: data.icon === 'plus' }})
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
