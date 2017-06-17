'use strict'
import React from 'react'
import PropTypes from 'prop-types'
import { Table } from 'semantic-ui-react'

function GenericCelledTable ({ header, body, footer }) {
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
