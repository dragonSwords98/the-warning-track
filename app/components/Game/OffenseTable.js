'use strict'
import React from 'react'
import PropTypes from 'prop-types'
import { Button, Input, Checkbox, Table, Header } from 'semantic-ui-react'

import BattersBox from '@track/components/Game/BattersBox'

function OffenseTable ({ innings, mercyRuns, noMercyInningBegin, battingOrder, lockedInnings, statusGrid, advanceRunner, toggleInningLock }) {
  // Header Cells
  let headerCells = [<Table.HeaderCell key={'inning-header-cell'}>Batting</Table.HeaderCell>]
  for (let i = 1; i <= innings; i++) {
    headerCells.push(<Table.HeaderCell key={'inning-header-cell-' + i}>{i}</Table.HeaderCell>)
  }

  // Batter Cells
  const generateBatterCells = function (r, statusGrid) {
    let batterCells = []
    for (let i = 1; i <= innings; i++) {
      let box
      if (lockedInnings.indexOf(i) > -1) {
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
        <Table.Cell><Header as="h4">{ battingOrder[r].name }</Header></Table.Cell>
        { generateBatterCells(r, statusGrid) }
      </Table.Row>
    )
  }

  // Our Runs and Our Outs Cells, along with mercies and max outs
  const THREEOUTS = 3
  const mercyRunInput = (disabled) => (<Input type="number" min="0" max={mercyRuns} fluid disabled={disabled} />)
  const noMercyRunInput = (disabled) => (<Input type="number" min="0" fluid disabled={disabled} />)
  const outsInput = (disabled) => (<Checkbox toggle disabled={disabled} />)

  let scoresheet = statusGrid.map((s, i) => {
    return s.reduce((acc, value) => {
      if (value.name === 'OUT' && acc[0] < THREEOUTS) {
        acc[0]++
      }
      if (value.name === 'HOME' && i < noMercyInningBegin && acc[1] < mercyRuns) {
        acc[1]++
      }
      return acc
    }, [0, 0])
  })

  // Creating Footer Cells
  let theirfooterOuts = [<Table.Cell key={'footer-their-outs-0'}><Header as="h4">THEIR OUTS</Header></Table.Cell>]
  for (let i = 1; i <= innings; i++) {
    theirfooterOuts.push(<Table.Cell key={'footer-their-outs-' + i}>{outsInput(lockedInnings.indexOf(i) > -1)}{outsInput(lockedInnings.indexOf(i) > -1)}{outsInput(lockedInnings.indexOf(i) > -1)}</Table.Cell>)
  }

  let ourfooterOuts = [<Table.Cell key={'footer-our-outs-0'}><Header as="h4">OUR OUTS</Header></Table.Cell>]
  for (let i = 1; i <= innings; i++) {
    ourfooterOuts.push(<Table.Cell key={'footer-our-outs-' + i}>{scoresheet[i - 1][0]}</Table.Cell>)
  }

  let theirFooterRuns = [<Table.Cell key={'footer-their-runs-0'}><Header as="h4">THEIR RUNS</Header></Table.Cell>]
  for (let i = 1; i <= innings; i++) {
    if (i < noMercyInningBegin) {
      theirFooterRuns.push(<Table.Cell key={'footer-their-runs-' + i}>{mercyRunInput(lockedInnings.indexOf(i) > -1)}</Table.Cell>)
    } else {
      theirFooterRuns.push(<Table.Cell key={'footer-their-runs-' + i}>{noMercyRunInput(lockedInnings.indexOf(i) > -1)}</Table.Cell>)
    }
  }

  let ourFooterRuns = [<Table.Cell key={'footer-our-runs-0'}><Header as="h4">OUR RUNS</Header></Table.Cell>]
  for (let i = 1; i <= innings; i++) {
    ourFooterRuns.push(<Table.Cell key={'footer-our-runs-' + i}>{scoresheet[i - 1][1]}</Table.Cell>)
  }

  let lockInnings = [<Table.Cell key={'footer-lock-0'}><Header as="h4">Lock</Header></Table.Cell>]
  for (let i = 1; i <= innings; i++) {
    let icon = lockedInnings.indexOf(i) > -1 ? 'lock' : 'unlock'
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
  mercyRuns: PropTypes.number.isRequired,
  noMercyInningBegin: PropTypes.number.isRequired,
  battingOrder: PropTypes.array.isRequired,
  statusGrid: PropTypes.array.isRequired,
  advanceRunner: PropTypes.func.isRequired,
  toggleInningLock: PropTypes.func.isRequired
}
export default OffenseTable
