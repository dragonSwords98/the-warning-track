'use strict'
import React from 'react'
import PropTypes from 'prop-types'
import OffenseTable from '@track/components/Game/OffenseTable'

function Game ({ id, innings, roster, statusGrid, advanceBatter, cumulativeRuns, cumulativeOuts }) {
  return (
    <OffenseTable innings={innings} roster={roster} statusGrid={statusGrid} advanceBatter={advanceBatter} cumulativeRuns={cumulativeRuns} cumulativeOuts={cumulativeOuts} />
  )
}
Game.propTypes = {
  id: PropTypes.number.isRequired,
  innings: PropTypes.number.isRequired,
  roster: PropTypes.array.isRequired,
  statusGrid: PropTypes.array.isRequired,
  advanceBatter: PropTypes.func.isRequired,
  cumulativeRuns: PropTypes.array.isRequired,
  cumulativeOuts: PropTypes.array.isRequired
}
export default Game
