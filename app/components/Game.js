'use strict'
import React from 'react'
import PropTypes from 'prop-types'
import { Divider } from 'semantic-ui-react'
import OffenseTable from '@track/components/Game/OffenseTable'
import FieldingLineup from '@track/components/Game/FieldingLineup'

function Game ({ id, innings, currentInning, mercyRuns, noMercyInningBegin, positions, fielding, battingOrder, statusGrid, hitGrid, scoresheet, advanceRunner, onRadialSelect, toggleRadialSelect, radialActive, changeHitType, onScoresheetChange, toggleInningLock, saveGame }) {
  return (
    <div>
      <Divider horizontal />
      <OffenseTable
        innings={innings}
        currentInning={currentInning}
        mercyRuns={mercyRuns}
        noMercyInningBegin={noMercyInningBegin}
        battingOrder={battingOrder}
        statusGrid={statusGrid}
        hitGrid={hitGrid}
        scoresheet={scoresheet}
        onRadialSelect={onRadialSelect}
        toggleRadialSelect={toggleRadialSelect}
        radialActive={radialActive}
        advanceRunner={advanceRunner}
        changeHitType={changeHitType}
        onScoresheetChange={onScoresheetChange}
        toggleInningLock={toggleInningLock}
        saveGame={saveGame} />
      <Divider horizontal />
     
    </div>
  )
  // <FieldingLineup positions={positions} fielding={fielding} currentInning={currentInning} />
}
Game.propTypes = {
  id: PropTypes.string.isRequired,
  innings: PropTypes.number.isRequired,
  currentInning: PropTypes.number.isRequired,
  mercyRuns: PropTypes.number.isRequired,
  noMercyInningBegin: PropTypes.number.isRequired,
  positions: PropTypes.array.isRequired,
  fielding: PropTypes.array.isRequired,
  battingOrder: PropTypes.array.isRequired,
  statusGrid: PropTypes.array.isRequired,
  hitGrid: PropTypes.array.isRequired,
  scoresheet: PropTypes.object.isRequired,
  onScoresheetChange: PropTypes.func.isRequired,
  advanceRunner: PropTypes.func.isRequired,
  saveGame: PropTypes.func.isRequired
}
export default Game
