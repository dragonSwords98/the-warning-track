import React, { Component } from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router'

import { loadGame } from '@track/actions/game-actions'
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

      // const STATUSES = [
      //   [{
      //   },
      //   {
      //     name: 'ON_DECK',
      //     label: 'Deck',
      //     color: 'orange',
      //   },
      //   {
      //     name: 'FIRST',
      //     label: '1st',
      //     color: 'red',
      //   },
      //   {
      //     name: 'IN_THE_HOLE',
      //     label: 'Hole',
      //     color: 'yellow',
      //   },
      //   {
      //     name: 'ON_DECK',
      //     label: 'Deck',
      //     color: 'orange',
      //   },
      //   {
      //     name: 'FIRST',
      //     label: '1st',
      //     color: 'red',
      //   },
      //   {
      //     name: 'FIRST',
      //     label: '1st',
      //     color: 'red',
      //   }]
        // 'SECOND',
        // 'THIRD',
        // 'HOME',
        // 'OUT'
      // ]

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
      // table size should be columns (innings.length + 1) x rows (roster + 1 w/ 4 end rows)

      //   const BASE_STATE = ['Hole', 'Deck', 'At Bat', '1st', '2nd', '3rd', 'Home', 'Out']
      //   const COLOR_STATE = ['yellow', 'orange', 'red', 'olive', 'green', 'teal', 'blue', 'black']

        //   let baseStateId = COLOR_STATE.indexOf(state.color)
        //   if (++baseStateId >= COLOR_STATE.length) {
        //     baseStateId = 0
        //   }
        //   state.color = COLOR_STATE[baseStateId]
        //   state.message = BASE_STATE[baseStateId]
        //   this.forceUpdate()
        // }
        //this.advanceBatter.bind(this)

    let generateScoresheet = function(innings) {
      let gameArray = []
      for (let i = 0; i < innings; i++) {
        gameArray.push({
          theirs: 0,
          ours: 0
        })
      }
      return gameArray
    }

    let cumulativeOuts = generateScoresheet(game.innings)
    let cumulativeRuns = generateScoresheet(game.innings)

    const generateNewGameStatuses = function (rows, columns, statusObject) {
      let statusArray = new Array()
      for (let r = 0; r < rows; r++) {
        let rowArray = new Array()
        for (let i = 0; i < columns; i++) {
          statusObject = Object.assign({ inning: i, row: r }, statusObject)
          rowArray.push(statusObject)
        }
        statusArray.push(rowArray)
      }
      return statusArray
    }
    let statusGrid = generateNewGameStatuses(directory.players.length, game.innings, IN_THE_HOLE_STATUS)

    return (
      <Game
        id={game.gameId}
        innings={game.innings}
        roster={directory.players}
        statusGrid={statusGrid}
        advanceBatter={this.props.advanceBatter}
        cumulativeRuns={cumulativeRuns}
        cumulativeOuts={cumulativeOuts} />
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
        dispatch(fetchDirectory('players'))
        dispatch(loadGame())
      },
      advanceBatter (event, data) {
        dispatch({ type: 'route.game-container/advanceBatter', payload: { event: event, data: data }})
        console.log('advanceBatter', event, data, this)
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
