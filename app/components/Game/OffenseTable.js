'use strict'
import React from 'react'
import PropTypes from 'prop-types'
import { Icon, Label, Menu, Table, Header } from 'semantic-ui-react'

import BattersBox from '@track/components/Game/BattersBox'

function OffenseTable ({ innings, roster }) {

  const STATUSES = [
    {
      name: 'IN_THE_HOLE',
      label: 'Hole',
      color: 'yellow',
    },
    {
      name: 'ON_DECK',
      label: 'Deck',
      color: 'orange',
    },
    {
      name: 'FIRST',
      label: '1st',
      color: 'red',
    }
    // 'SECOND',
    // 'THIRD',
    // 'HOME',
    // 'OUT'
  ]

  const DISABLED = 'disabled'
  const OUT_STATUS = {
    name: 'OUT',
    label: 'Out',
    color: 'black'
  }

  const handleEvent = function () {
    console.log('an event!')
  }

  // table size should be columns (innings.length + 1) x rows (roster + 1 w/ 4 end rows)

  var headerCells = [<Table.HeaderCell key='inning-header-cell'>Roster</Table.HeaderCell>]
  for (let i = 1; i <= innings; i++) {
    headerCells.push(<Table.HeaderCell key={'inning-header-cell-' + i}>{i}</Table.HeaderCell>)
  }

  var batterCells = []
  for (let i = 1; i <= innings; i++) {
    batterCells.push(
      <Table.Cell key={'inning-cell-' + i} className='batter-cell'>
        <BattersBox key={'inning-bat-box-' + i} status={STATUSES[0]} handleEvent={handleEvent}/>
      </Table.Cell>
    )
  }

  var batterRows = []
  for (let r = 0; r < roster.length; r++) {
    batterRows.push(
      <Table.Row key={'batter-row-' + r}>
        <Table.Cell><Header as='h4'>{ roster[r].name }</Header></Table.Cell>
        {batterCells}
      </Table.Row>
    )
  }

  var footerCells = []
  for (let i = 1; i <= innings; i++) {
    footerCells.push(<Table.Cell key={'footer-cell-' + i}>{i}</Table.Cell>)
  }

  var ourFooterHeaders = [<Table.HeaderCell key='footer-our-0'><Header as='h4'>OUR RUNS</Header></Table.HeaderCell>]
  for (let i = 1; i <= innings; i++) {
    ourFooterHeaders.push(<Table.HeaderCell key={'footer-our-' + i}>{i}</Table.HeaderCell>)
  }

  var theirFooterHeaders = [<Table.HeaderCell key='footer-their-0'><Header as='h4'>THEIR RUNS</Header></Table.HeaderCell>]
  for (let i = 1; i <= innings; i++) {
    theirFooterHeaders.push(<Table.HeaderCell key={'footer-their-' + i}>{i}</Table.HeaderCell>)
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
          { theirFooterHeaders }
        </Table.Row>
        <Table.Row>
          <Table.Cell><Header as='h4'>THEIR OUTS</Header></Table.Cell>
          { footerCells }
        </Table.Row>
        <Table.Row>
          { ourFooterHeaders }
        </Table.Row>
        <Table.Row>
          <Table.Cell><Header as='h4'>OUR OUTS</Header></Table.Cell>
          { footerCells }
        </Table.Row>
      </Table.Footer>
    </Table>
  )
}
OffenseTable.propTypes = {
  innings: PropTypes.number.isRequired,
  roster: PropTypes.array.isRequired
}
export default OffenseTable
