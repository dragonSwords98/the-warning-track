import React, { Component } from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router'
import { Tab, Confirm, Modal } from 'semantic-ui-react'


import { objectToOption } from '@track/utils/constants'
import { loadGame, saveGame, confirmGameModal } from '@track/actions/game'
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
    const { game, opponent, saveGame, restartGame, submitGame,
      onScoresheetChange, toggleInningLock, onChangeOpposingBattersCount,
      onRadialSelect, toggleRadialSelect, onChangeOpponentName, onChangeOpponentNumber,
      onChangeHitType, onChangeDepth, onChangeLane, onCancelGameConfirm, onGameConfirm
    } = this.props

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
      hitGrid={game.hitGrid}
      scoresheet={game.scoresheet}
      onRadialSelect={onRadialSelect}
      toggleRadialSelect={toggleRadialSelect}
      hitRadialActive={game.hitRadialActive}
      baseRadialActive={game.baseRadialActive}
      onScoresheetChange={onScoresheetChange}
      toggleInningLock={toggleInningLock}
      saveGame={saveGame}
      restartGame={restartGame}
      submitGame={submitGame} />

    const OpponentComponent = (
      <OpponentOffenseTable
        innings={game.league.innings}
        currentInning={game.currentInning}
        opposingBattingReport={game.opposingBattingReport}
        onChangeOpposingBattersCount={onChangeOpposingBattersCount}
        toggleInningLock={toggleInningLock}
        hitTypeOptions={opponent.hitTypeOptions}
        depthOptions={opponent.depthOptions}
        laneOptions={opponent.laneOptions}
        onChangeOpponentName={onChangeOpponentName}
        onChangeOpponentNumber={onChangeOpponentNumber}
        onChangeHitType={onChangeHitType}
        onChangeDepth={onChangeDepth}
        onChangeLane={onChangeLane} />)

    const panes = [
      { menuItem: game.ourTeam.name, render: () => <Tab.Pane attached={false}>{ OurTeamComponent }</Tab.Pane> },
      { menuItem: game.opposingTeam, render: () => <Tab.Pane attached={false}>{ OpponentComponent }</Tab.Pane> }
    ]
    const GameMenu = <Tab menu={{ secondary: true, pointing: true }} panes={panes} onTabChange={saveGame} />

// <Button onClick={toggleGameBar}></Button>
//         <Sidebar.Pushable as={Segment}>
//           <Sidebar
//             as={Menu}
//             animation='overlay'
//             width='thin'
//             direction='right'
//             visible={visible}
//             icon='labeled'
//             vertical
//             inverted
//           >
//             <Menu.Item name='restart'>
//               <Icon name='erase' />
//               Restart
//             </Menu.Item>
//             <Menu.Item name='save'>
//               <Icon name='save' />
//               Save
//             </Menu.Item>
//             <Menu.Item name='saveClose'>
//               <Icon name='power' />
//               Save & Close
//             </Menu.Item>
//             <Menu.Item name='complete'>
//               <Icon name='send' />
//               Submit & End Game
//             </Menu.Item>
//           </Sidebar>
//           <Sidebar.Pusher>  
//             { GameMenu }
//           </Sidebar.Pusher>
//         </Sidebar.Pushable>

    let GameModal = ''

    if (game.prompt) {
      if (game.prompt.type === 'error') {
        //TODO: 
        GameModal = <Modal trigger={!!game.prompt} basic size='small'>
                      <Modal.Content>
                        <p>{ game.prompt.message }</p>
                      </Modal.Content>
                      <Modal.Actions>
                        <Button basic color='red' inverted>
                          <Icon name='remove' /> No
                        </Button>
                        <Button color='green' inverted>
                          <Icon name='checkmark' /> Yes
                        </Button>
                      </Modal.Actions>
                    </Modal>
      } else {
        GameModal = <Confirm
                    open={!!game.prompt}
                    content={game.prompt.message}
                    onCancel={onCancelGameConfirm}
                    onConfirm={onGameConfirm}
                  />  
      }
    }

    return (
      <div>
        { GameMenu }
        { GameModal }
      </div>
    )
  }
}
export default withRouter(connect(
  function mapStateToProps (state, ownProps) {
    return {
      game: state.game,
      opponent: state.opponent
    }
  },
  function mapDispatchToProps (dispatch, ownProps) {
    return {
      loadGame (gameId) {
        dispatch(loadGame(gameId))
        dispatch({ type: 'game.opponent/init' })
      },
      onScoresheetChange (event, data) {
        dispatch({ type: 'game.scoresheet/update', payload: { target: event.target, data: data } })
      },
      onRadialSelect (event, data) {
        dispatch({ type: 'game.radial-select/select', payload: { target: event.target, data: data } })
      },
      toggleRadialSelect (event, data) {
        dispatch({ type: 'game.radial-select/toggle', payload: { target: event.target, data: data } })
      },
      toggleInningLock (event, data) {
        dispatch({ type: 'game.lock-inning/toggle', payload: { inning: data.data } })
        dispatch(saveGame())
      },
      onChangeOpponentName (event, data) {
        dispatch({ type: 'game.opponent-name/change', payload: { target: event.target, data: data } })
      },
      onChangeOpponentNumber (event, data) {
        dispatch({ type: 'game.opponent-number/change', payload: { target: event.target, data: data } })
      },
      onChangeOpposingBattersCount (event, data) {
        dispatch({ type: 'game.opponent/set-number-of-batters', payload: { increment: data.icon === 'plus' } })
      },
      onChangeHitType (event, data) {
        dispatch({ type: 'game.opponent-batter/change-hit-type', payload: { target: event.target, data: data } })
      },
      onChangeDepth (event, data) {
        dispatch({ type: 'game.opponent-batter/change-depth', payload: { target: event.target, data: data } })
      },
      onChangeLane (event, data) {
        dispatch({ type: 'game.opponent-batter/change-lane', payload: { target: event.target, data: data } })
      },
      saveGame () {
        dispatch(saveGame())
      },
      restartGame () {
        dispatch({ type: 'game/prompt-restart' })
      },
      submitGame () {
        dispatch({ type: 'game/prompt-submit' })
      },
      onCancelGameConfirm (event, data) {
        dispatch({ type: 'game/prompt-cancelled' })
      },
      onGameConfirm (event, data) {
        dispatch(confirmGameModal())
      },
      destroy () {
        dispatch({ type: 'route.game-container/destroy' })
      }
    }
  }
)(GameContainer))
