'use strict'
import React from 'react'
import PropTypes from 'prop-types'
import { Divider } from 'semantic-ui-react'
import OffenseTable from '@track/components/Game/OffenseTable'
import FieldingLineup from '@track/components/Game/FieldingLineup'

function Game ({ id, innings, mercyRuns, noMercyInningBegin, positions, fielding, roster, statusGrid, lockedInnings, advanceRunner, toggleInningLock }) {
  return (
    <div>
      <OffenseTable innings={innings} mercyRuns={mercyRuns} noMercyInningBegin={noMercyInningBegin} roster={roster} lockedInnings={lockedInnings} statusGrid={statusGrid} advanceRunner={advanceRunner} toggleInningLock={toggleInningLock} />
      <Divider horizontal></Divider>
      <FieldingLineup positions={positions} fielding={fielding} />
    </div>
  )
}
Game.propTypes = {
  id: PropTypes.number.isRequired,
  innings: PropTypes.number.isRequired,
  mercyRuns: PropTypes.number.isRequired,
  noMercyInningBegin: PropTypes.number.isRequired,
  positions: PropTypes.array.isRequired,
  fielding: PropTypes.array.isRequired,
  roster: PropTypes.array.isRequired,
  statusGrid: PropTypes.array.isRequired,
  advanceRunner: PropTypes.func.isRequired
}
export default Game
