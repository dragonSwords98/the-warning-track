'use strict'
import React from 'react'
import PropTypes from 'prop-types'
import { Divider } from 'semantic-ui-react'
import OffenseTable from '@track/components/Game/OffenseTable'
import FieldingLineup from '@track/components/Game/FieldingLineup'

function Game ({ id, innings, currentInning, mercyRuns, noMercyInningBegin, positions, fielding, battingOrder, statusGrid, scoresheet, advanceRunner, onScoresheetChange, toggleInningLock }) {
  return (
    <div>
      <OffenseTable
        innings={innings}
        currentInning={currentInning}
        mercyRuns={mercyRuns}
        noMercyInningBegin={noMercyInningBegin}
        battingOrder={battingOrder}
        statusGrid={statusGrid}
        scoresheet={scoresheet}
        advanceRunner={advanceRunner}
        onScoresheetChange={onScoresheetChange}
        toggleInningLock={toggleInningLock} />
      <Divider horizontal />
      <FieldingLineup positions={positions} fielding={fielding} currentInning={currentInning} />
    </div>
  )
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
  scoresheet: PropTypes.object.isRequired,
  onScoresheetChange: PropTypes.func.isRequired,
  advanceRunner: PropTypes.func.isRequired
}
export default Game
