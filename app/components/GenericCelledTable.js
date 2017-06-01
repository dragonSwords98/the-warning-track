'use strict'
import React from 'react'
import PropTypes from 'prop-types'
import { Table } from 'semantic-ui-react'

function GenericCelledTable ({ header, body, footer }) {


  // var headerCells = [<Table.HeaderCell key='inning-header-cell'>Roster</Table.HeaderCell>]
  // for (let i = 1; i <= innings; i++) {
  //   headerCells.push(<Table.HeaderCell key={'inning-header-cell-' + i}>{i}</Table.HeaderCell>)
  // }

  // var batterCells = []
  // for (let i = 1; i <= innings; i++) {
  //   batterCells.push(
  //     <Table.Cell key={'inning-cell-' + i} className='batter-cell'>
  //       <BattersBox key={'inning-bat-box-' + i} status={STATUSES[0]} handleEvent={handleEvent}/>
  //     </Table.Cell>
  //   )
  // }

  // var batterRows = []
  // for (let r = 0; r < roster.length; r++) {
  //   batterRows.push(
  //     <Table.Row key={'batter-row-' + r}>
  //       <Table.Cell><Header as='h4'>{ roster[r].name }</Header></Table.Cell>
  //       {batterCells}
  //     </Table.Row>
  //   )
  // }

  // var footerCells = []
  // for (let i = 1; i <= innings; i++) {
  //   footerCells.push(<Table.Cell key={'footer-cell-' + i}>{i}</Table.Cell>)
  // }

  // var ourFooterHeaders = [<Table.HeaderCell key='footer-our-0'><Header as='h4'>OUR RUNS</Header></Table.HeaderCell>]
  // for (let i = 1; i <= innings; i++) {
  //   ourFooterHeaders.push(<Table.HeaderCell key={'footer-our-' + i}>{i}</Table.HeaderCell>)
  // }

  // var theirFooterHeaders = [<Table.HeaderCell key='footer-their-0'><Header as='h4'>THEIR RUNS</Header></Table.HeaderCell>]
  // for (let i = 1; i <= innings; i++) {
  //   theirFooterHeaders.push(<Table.HeaderCell key={'footer-their-' + i}>{i}</Table.HeaderCell>)
  // }

  // columns, rows, cells

  return (
    <Table celled>
      <Table.Header>
        <Table.Row>
          { header }
        </Table.Row>
      </Table.Header>
      <Table.Body>
        { body }
      </Table.Body>
      <Table.Footer>
        <Table.Row>
          { footer }    
        </Table.Row>
      </Table.Footer>
    </Table>
  )
}
GenericCelledTable.propTypes = {
  header: PropTypes.array,
  body: PropTypes.array.isRequired,
  footer: PropTypes.array
}
export default GenericCelledTable
