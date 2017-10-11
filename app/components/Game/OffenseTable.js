'use strict'
import React from 'react'
import PropTypes from 'prop-types'
import { Button, Input, Checkbox, Table, Header } from 'semantic-ui-react'

import BattersBox from '@track/components/Game/BattersBox'
import { STATUS_ORDERING, HIT_ORDERING } from '@track/utils/constants'

function OffenseTable ({
    innings,
    currentInning,
    mercyRuns,
    noMercyInningBegin,
    battingOrder,
    statusGrid,
    hitGrid,
    scoresheet,
    toggleRadialSelect,
    onRadialSelect,
    baseRadialActive,
    hitRadialActive,
    onScoresheetChange,
    toggleInningLock,
    saveGame,
    restartGame,
    submitGame
  }) {
  // Header Cells
  let headerCells = [
    <Table.HeaderCell key={'inning-header-cell'} width='two'>
      { 'Batting ' }
      <Button circular icon='save' color='green' onClick={saveGame} />
      <Button circular icon='erase' color='yellow' onClick={restartGame} />
      <Button circular icon='send' color='red' onClick={submitGame} />
    </Table.HeaderCell>]
  for (let i = 0; i <= innings - 1; i++) {
    headerCells.push(<Table.HeaderCell key={'inning-header-cell-' + i}>{i+1}</Table.HeaderCell>)
  }

  // Batter Cells
  const generateBatterCells = function (r, currentInning, statusGrid, hitGrid, onRadialSelect, toggleRadialSelect, baseRadialActive, hitRadialActive) {

    let batterCells = []
    for (let i = 0; i <= innings - 1; i++) {
      let isBatOpen = baseRadialActive[0] === i && baseRadialActive[1] === r
      let isHitOpen = hitRadialActive[0] === i && hitRadialActive[1] === r

      batterCells.push(
        <BattersBox
          key={`batter-box-${r}-${i}`}
          r={r}
          i={i}
          currentInning={currentInning}
          locationStatus={statusGrid[i][r]}
          hitStatus={hitGrid[i][r]}
          onRadialSelect={onRadialSelect}
          toggleRadialSelect={toggleRadialSelect}
          isBatOpen={isBatOpen}
          isHitOpen={isHitOpen} />)
      // let isBatOpen = baseRadialActive[0] === i && baseRadialActive[1] === r
      // let isHitOpen = hitRadialActive[0] === i && hitRadialActive[1] === r

      // const layer = CIRCULAR_SELECT_LAYERS

      // let hitReport = <CircularSelect
      //                   key={`hit-inning-cs-${r}-${i}}`}
      //                   layer={layer[0]}
      //                   row={r}
      //                   inning={i}
      //                   status={hitGrid[i][r]}
      //                   isOpen={isHitOpen}
      //                   onToggle={toggleRadialSelect}
      //                   onSelect={onRadialSelect}
      //                   disabled={currentInning !== i} />

      // let location = <CircularSelect
      //                   key={`location-inning-cs-${r}-${i}}`}
      //                   layer={layer[1]}
      //                   row={r}
      //                   inning={i}
      //                   status={statusGrid[i][r]}
      //                   isOpen={isBatOpen}
      //                   onToggle={toggleRadialSelect}
      //                   onSelect={onRadialSelect}
      //                   disabled={currentInning !== i} />

      // batterCells.push(<Table.Cell key={`inning-cell-${r}-${i}}`} className="batter-cell">
      //   {location}
      //   {hitReport}
      // </Table.Cell>)
    }
    return batterCells
  }

  let batterRows = []
  for (let r = 0; r < battingOrder.length; r++) {
    batterRows.push(
      <Table.Row key={'batter-row-' + r}>
        <Table.Cell width='two'><Header as="h4">{ battingOrder[r].name }</Header></Table.Cell>
        { generateBatterCells(r, currentInning, statusGrid, hitGrid, onRadialSelect, toggleRadialSelect, baseRadialActive, hitRadialActive) }
      </Table.Row>
    )
  }

  // Our Runs and Our Outs Cells, along with mercies and max outs
  const THREEOUTS = 3
  const mercyRunInput = (inning, team, disabled, value) => (<Input data-team={team} data-inning={inning} type="number" min="0" max={mercyRuns} value={value} fluid disabled={disabled} onChange={onScoresheetChange} />)
  const noMercyRunInput = (inning, team, disabled, value) => (<Input data-team={team} data-inning={inning} type="number" min="0" value={value} fluid disabled={disabled} onChange={onScoresheetChange} />)
  const outsInput = (inning, team, disabled, checked) => (<Checkbox data-team={team} data-inning={inning} checked={checked} toggle disabled={disabled} onChange={onScoresheetChange} />)

  // Creating Footer Cells
  let theirfooterOuts = [<Table.Cell key={'footer-their-outs-title'}><Header as="h4">THEIR OUTS</Header></Table.Cell>]
  for (let i = 0; i <= innings - 1; i++) {
    let outs = scoresheet.theirs.outs[i]
    theirfooterOuts.push(<Table.Cell key={'footer-their-outs-' + i}>{outsInput(i, 'theirs', currentInning !== i, outs > 2)}{outsInput(i, 'theirs', currentInning !== i, outs > 1)}{outsInput(i, 'theirs', currentInning !== i, outs > 0)}</Table.Cell>)
  }

  let ourfooterOuts = [<Table.Cell key={'footer-our-outs-title'}><Header as="h4">OUR OUTS</Header></Table.Cell>]
  for (let i = 0; i <= innings - 1; i++) {
    ourfooterOuts.push(<Table.Cell key={'footer-our-outs-' + i}>{scoresheet.ours.outs[i]}</Table.Cell>)
  }

  let theirFooterRuns = [<Table.Cell key={'footer-their-runs-title'}><Header as="h4">THEIR RUNS</Header></Table.Cell>]
  for (let i = 0; i <= innings - 1; i++) {
    let runs = scoresheet.theirs.runs[i]
    if (i < noMercyInningBegin) {
      theirFooterRuns.push(<Table.Cell key={'footer-their-runs-' + i}>{mercyRunInput(i, 'theirs', currentInning !== i, runs)}</Table.Cell>)
    } else {
      theirFooterRuns.push(<Table.Cell key={'footer-their-runs-' + i}>{noMercyRunInput(i, 'theirs', currentInning !== i, runs)}</Table.Cell>)
    }
  }

  let ourFooterRuns = [<Table.Cell key={'footer-our-runs-title'}><Header as="h4">OUR RUNS</Header></Table.Cell>]
  for (let i = 0; i <= innings - 1; i++) {
    ourFooterRuns.push(<Table.Cell key={'footer-our-runs-' + i}>{scoresheet.ours.runs[i]}</Table.Cell>)
  }

  let lockInnings = [<Table.Cell key={'footer-lock-title'}><Header as="h4">Completed</Header></Table.Cell>]
  for (let i = 0; i <= innings - 1; i++) {
    let icon = currentInning === i ? 'checkmark' : 'lock'
    lockInnings.push(<Table.Cell key={'footer-lock-' + i}><Button data={i} circular icon={icon} onClick={toggleInningLock} /></Table.Cell>)
  }

  return (
    <Table celled>
      <Table.Header>
        <Table.Row>
          { headerCells }
        </Table.Row>
      </Table.Header>

      <Table.Body>
        { batterRows }
      </Table.Body>

      <Table.Footer>
        <Table.Row>
          { ourFooterRuns }
        </Table.Row>
        <Table.Row>
          { ourfooterOuts }
        </Table.Row>
        <Table.Row>
          { theirFooterRuns }
        </Table.Row>
        <Table.Row>
          { theirfooterOuts }
        </Table.Row>
        <Table.Row>
          { lockInnings }
        </Table.Row>
      </Table.Footer>
    </Table>
  )
}
export default OffenseTable
