'use strict'
import React from 'react'
import PropTypes from 'prop-types'
import { Button, Input, Checkbox, Table, Header } from 'semantic-ui-react'

import BattersBox from '@track/components/Game/BattersBox'

function OffenseTable ({ innings, currentInning, mercyRuns, noMercyInningBegin, battingOrder, statusGrid, scoresheet, advanceRunner, onScoresheetChange, toggleInningLock }) {
  // Header Cells
  let headerCells = [<Table.HeaderCell key={'inning-header-cell'} width='two'>Batting</Table.HeaderCell>]
  for (let i = 1; i <= innings; i++) {
    headerCells.push(<Table.HeaderCell key={'inning-header-cell-' + i}>{i}</Table.HeaderCell>)
  }

  // Batter Cells
  const generateBatterCells = function (r, statusGrid) {
    let batterCells = []
    for (let i = 1; i <= innings; i++) {
      let box
      if (currentInning !== i) {
        box = <BattersBox key={`inning-bat-box-${r}-${i}}`} row={r} inning={i} status={statusGrid[i - 1][r]} advanceRunner={advanceRunner} disabled />
      } else {
        box = <BattersBox key={`inning-bat-box-${r}-${i}}`} row={r} inning={i} status={statusGrid[i - 1][r]} advanceRunner={advanceRunner} />
      }
      batterCells.push(<Table.Cell key={`inning-cell-${r}-${i}}`} className="batter-cell">{box}</Table.Cell>)
    }
    return batterCells
  }

  let batterRows = []
  for (let r = 0; r < battingOrder.length; r++) {
    batterRows.push(
      <Table.Row key={'batter-row-' + r}>
        <Table.Cell width='two'><Header as="h4">{ battingOrder[r].name }</Header></Table.Cell>
        { generateBatterCells(r, statusGrid) }
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
  scoresheet: PropTypes.object.isRequired,
  advanceRunner: PropTypes.func.isRequired,
  onScoresheetChange: PropTypes.func.isRequired,
  toggleInningLock: PropTypes.func.isRequired
}
export default OffenseTable
