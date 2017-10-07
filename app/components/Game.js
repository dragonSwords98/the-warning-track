'use strict'
import React from 'react'
import { Divider } from 'semantic-ui-react'
import OffenseTable from '@track/components/Game/OffenseTable'
import FieldingLineup from '@track/components/Game/FieldingLineup'

function Game ({
  id,
  innings,
  currentInning,
  mercyRuns,
  noMercyInningBegin,
  positions,
  fielding,
  battingOrder,
  statusGrid,
  hitGrid,
  scoresheet,
  onRadialSelect,
  toggleRadialSelect,
  baseRadialActive,
  hitRadialActive,
  onScoresheetChange,
  toggleInningLock,
  saveGame,
  restartGame,
  submitGame
}) {
  return (
    <div>
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
        baseRadialActive={baseRadialActive}
        hitRadialActive={hitRadialActive}
        onScoresheetChange={onScoresheetChange}
        toggleInningLock={toggleInningLock}
        saveGame={saveGame}
        restartGame={restartGame}
        submitGame={submitGame} />
      <FieldingLineup positions={positions} fielding={fielding} currentInning={currentInning} />
    </div>
  )
}
export default Game
