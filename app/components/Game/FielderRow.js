'use strict'
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Header, Table } from 'semantic-ui-react'

import LoadingOverlay from '@track/components/LoadingOverlay'
import FielderCell from '@track/components/Game/FielderCell'

class FielderRow extends Component {
  render () {
    const { lineup, innings, lockedInnings, position, options, onChange } = this.props

    if (!innings || !position || !options || !onChange) {
      return <LoadingOverlay />
    }

    let inningsArray = Array.from({ length: innings }, (v, k) => ++k)
    let cells = inningsArray.map(i =>
      <FielderCell key={'fielder-cell-' + i}
        value={lineup[i]}
        inning={i}
        position={position}
        lockedInning={lockedInnings.indexOf(i) > -1}
        options={options}
        onChange={onChange} />)

    return (
      <Table.Row>
        <Table.Cell>
          <Header as="h4">{ position }</Header>
        </Table.Cell>
        {cells}
      </Table.Row>)
  }
}
FielderRow.propTypes = {
  lineup: PropTypes.array.isRequired,
  innings: PropTypes.number.isRequired,
  lockedInnings: PropTypes.array.isRequired,
  position: PropTypes.string.isRequired,
  options: PropTypes.array.isRequired,
  onChange: PropTypes.func.isRequired
}
export default FielderRow
