'use strict'
import React from 'react'
import PropTypes from 'prop-types'
import { Button, Input, Checkbox, Table, Header } from 'semantic-ui-react'

import CircularSelect from '@track/components/Game/CircularSelect'
import { STATUS_ORDERING, HIT_ORDERING, CIRCULAR_SELECT_LAYERS } from '@track/utils/constants'

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
    radialActive,
    advanceRunner,
    changeHitType,
    onScoresheetChange,
    toggleInningLock,
    saveGame
  }) {
  // Header Cells
  let headerCells = [
    <Table.HeaderCell key={'inning-header-cell'} width='two'>
      { 'Batting ' }
      <Button circular icon='save' onClick={saveGame} />
    </Table.HeaderCell>]
  for (let i = 1; i <= innings; i++) {
    headerCells.push(<Table.HeaderCell key={'inning-header-cell-' + i}>{i}</Table.HeaderCell>)
  }

  // Batter Cells
  const generateBatterCells = function (r, statusGrid, hitGrid, radialActive) {

    let batterCells = []
    for (let i = 1; i <= innings; i++) {

      let options = []
      let isOpen = radialActive[0] === i && radialActive[1] === r

      const layer = CIRCULAR_SELECT_LAYERS

      let location = <CircularSelect
                        key={`location-inning-cs-${r}-${i}}`}
                        layer={layer[0]}
                        options={options}
                        row={r}
                        inning={i}
                        status={statusGrid[i - 1][r]}
                        isOpen={isOpen}
                        onToggle={toggleRadialSelect}
                        onSelect={onRadialSelect}
                        disabled={currentInning !== i} />

      let hitReport = <CircularSelect
                        key={`hit-inning-cs-${r}-${i}}`}
                        layer={layer[1]}
                        options={options}
                        row={r}
                        inning={i}
                        status={hitGrid[i - 1][r]}
                        isOpen={isOpen}
                        onToggle={toggleRadialSelect}
                        onSelect={onRadialSelect}
                        disabled={currentInning !== i} />

      batterCells.push(<Table.Cell key={`inning-cell-${r}-${i}}`} className="batter-cell">
        {location}
        {hitReport}
      </Table.Cell>)
    }
    return batterCells
  }

  let batterRows = []
  for (let r = 0; r < battingOrder.length; r++) {
    batterRows.push(
      <Table.Row key={'batter-row-' + r}>
        <Table.Cell width='two'><Header as="h4">{ battingOrder[r].name }</Header></Table.Cell>
        { generateBatterCells(r, statusGrid, hitGrid, radialActive) }
      </Table.Row>
    )
  }

  // Our Runs and Our Outs Cells, along with mercies and max outs
  const THREEOUTS = 3
  const mercyRunInput = (inning, team, disabled, value) => (<Input data-team={team} data-inning={inning} type="number" min="0" max={mercyRuns} value={value} fluid disabled={disabled} onChange={onScoresheetChange} />)
  const noMercyRunInput = (inning, team, disabled, value) => (<Input data-team={team} data-inning={inning} type="number" min="0" value={value} fluid disabled={disabled} onChange={onScoresheetChange} />)
  const outsInput = (inning, team, disabled, checked) => (<Checkbox data-team={team} data-inning={inning} checked={checked} toggle disabled={disabled} onChange={onScoresheetChange} />)

  // Creating Footer Cells
  let theirfooterOuts = [<Table.Cell key={'footer-their-outs-0'}><Header as="h4">THEIR OUTS</Header></Table.Cell>]
  for (let i = 1; i <= innings; i++) {
    let outs = scoresheet.theirs.outs[i-1]
    theirfooterOuts.push(<Table.Cell key={'footer-their-outs-' + i}>{outsInput(i, 'theirs', currentInning !== i, outs > 2)}{outsInput(i, 'theirs', currentInning !== i, outs > 1)}{outsInput(i, 'theirs', currentInning !== i, outs > 0)}</Table.Cell>)
  }

  let ourfooterOuts = [<Table.Cell key={'footer-our-outs-0'}><Header as="h4">OUR OUTS</Header></Table.Cell>]
  for (let i = 1; i <= innings; i++) {
    ourfooterOuts.push(<Table.Cell key={'footer-our-outs-' + i}>{scoresheet.ours.outs[i - 1]}</Table.Cell>)
  }

  let theirFooterRuns = [<Table.Cell key={'footer-their-runs-0'}><Header as="h4">THEIR RUNS</Header></Table.Cell>]
  for (let i = 1; i <= innings; i++) {
    let runs = scoresheet.theirs.runs[i-1]
    if (i < noMercyInningBegin) {
      theirFooterRuns.push(<Table.Cell key={'footer-their-runs-' + i}>{mercyRunInput(i, 'theirs', currentInning !== i, runs)}</Table.Cell>)
    } else {
      theirFooterRuns.push(<Table.Cell key={'footer-their-runs-' + i}>{noMercyRunInput(i, 'theirs', currentInning !== i, runs)}</Table.Cell>)
    }
  }

  let ourFooterRuns = [<Table.Cell key={'footer-our-runs-0'}><Header as="h4">OUR RUNS</Header></Table.Cell>]
  for (let i = 1; i <= innings; i++) {
    ourFooterRuns.push(<Table.Cell key={'footer-our-runs-' + i}>{scoresheet.ours.runs[i - 1]}</Table.Cell>)
  }

  let lockInnings = [<Table.Cell key={'footer-lock-0'}><Header as="h4">Completed</Header></Table.Cell>]
  for (let i = 1; i <= innings; i++) {
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
OffenseTable.propTypes = {
  innings: PropTypes.number.isRequired,
  currentInning: PropTypes.number.isRequired,
  mercyRuns: PropTypes.number.isRequired,
  noMercyInningBegin: PropTypes.number.isRequired,
  battingOrder: PropTypes.array.isRequired,
  statusGrid: PropTypes.array.isRequired,
  hitGrid: PropTypes.array.isRequired,
  scoresheet: PropTypes.object.isRequired,
  toggleRadialSelect: PropTypes.func.isRequired,
  onRadialSelect: PropTypes.func.isRequired,
  advanceRunner: PropTypes.func.isRequired,
  changeHitType: PropTypes.func.isRequired,
  onScoresheetChange: PropTypes.func.isRequired,
  toggleInningLock: PropTypes.func.isRequired,
  saveGame: PropTypes.func.isRequired
}
export default OffenseTable
