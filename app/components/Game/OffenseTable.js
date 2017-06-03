'use strict'
import React from 'react'
import PropTypes from 'prop-types'
import { Icon, Label, Menu, Table, Header } from 'semantic-ui-react'

import BattersBox from '@track/components/Game/BattersBox'

function OffenseTable ({ innings, roster, statusGrid, advanceBatter, cumulativeRuns, cumulativeOuts }) {

  var headerCells = [<Table.HeaderCell key='inning-header-cell'>Roster</Table.HeaderCell>]
  for (let i = 1; i <= innings; i++) {
    headerCells.push(<Table.HeaderCell key={'inning-header-cell-' + i}>{i}</Table.HeaderCell>)
  }

  const generateBatterCells = function (r, statusGrid) {
    let batterCells = []
    for (let i = 1; i <= innings; i++) {
      batterCells.push(
        <Table.Cell key={'inning-cell-' + r + '-' + i} className='batter-cell'>
          <BattersBox key={'inning-bat-box-' + r + '-' + i} status={statusGrid[r][i-1]} advanceBatter={advanceBatter}/>
        </Table.Cell>
      )
    }
    return batterCells
  }

  var batterRows = []
  for (let r = 0; r < roster.length; r++) {

    batterRows.push(
      <Table.Row key={'batter-row-' + r}>
        <Table.Cell><Header as='h4'>{ roster[r].name }</Header></Table.Cell>
        {
          generateBatterCells(r, statusGrid)
        }
      </Table.Row>
    )
  }

  var theirfooterOuts = [<Table.Cell key='footer-their-outs-0'><Header as='h4'>THEIR OUTS</Header></Table.Cell>]
  for (let i = 1; i <= innings; i++) {
    theirfooterOuts.push(<Table.Cell key={'footer-their-outs-' + i}>{cumulativeOuts[i-1].theirs}</Table.Cell>)
  }

  var ourfooterOuts = [<Table.Cell key='footer-our-outs-0'><Header as='h4'>OUR OUTS</Header></Table.Cell>]
  for (let i = 1; i <= innings; i++) {
    ourfooterOuts.push(<Table.Cell key={'footer-our-outs-' + i}>{cumulativeOuts[i-1].ours}</Table.Cell>)
  }

  var theirFooterRuns = [<Table.HeaderCell key='footer-their-runs-0'><Header as='h4'>THEIR RUNS</Header></Table.HeaderCell>]
  for (let i = 1; i <= innings; i++) {
    theirFooterRuns.push(<Table.HeaderCell key={'footer-their-runs-' + i}>{cumulativeRuns[i-1].theirs}</Table.HeaderCell>)
  }

  var ourFooterRuns = [<Table.HeaderCell key='footer-our-runs-0'><Header as='h4'>OUR RUNS</Header></Table.HeaderCell>]
  for (let i = 1; i <= innings; i++) {
    ourFooterRuns.push(<Table.HeaderCell key={'footer-our-runs-' + i}>{cumulativeRuns[i-1].ours}</Table.HeaderCell>)
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
          { theirFooterRuns }
        </Table.Row>
        <Table.Row>
          { theirfooterOuts }
        </Table.Row>
        <Table.Row>
          { ourFooterRuns }
        </Table.Row>
        <Table.Row>
          { ourfooterOuts }
        </Table.Row>
      </Table.Footer>
    </Table>
  )
}
OffenseTable.propTypes = {
  innings: PropTypes.number.isRequired,
  roster: PropTypes.array.isRequired,
  statusGrid: PropTypes.array.isRequired,
  advanceBatter: PropTypes.func.isRequired,
  cumulativeRuns: PropTypes.array.isRequired,
  cumulativeOuts: PropTypes.array.isRequired
}
export default OffenseTable
