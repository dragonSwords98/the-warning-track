'use strict'
import React from 'react'
import PropTypes from 'prop-types'
import OffenseTable from '@track/components/Game/OffenseTable'

function Game ({ id, innings, roster }) {
  return (
    <OffenseTable innings={innings} roster={roster} />
  )
}
Game.propTypes = {
  id: PropTypes.number.isRequired,
  innings: PropTypes.number.isRequired,
  roster: PropTypes.array.isRequired
}
export default Game
