'use strict'
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Header, Table, Button } from 'semantic-ui-react'

import LoadingOverlay from '@track/components/LoadingOverlay'
import FielderCell from '@track/components/Game/FielderCell'

class FielderRow extends Component {
  render () {
    const { lineup, innings, lockedInnings, position, options, onChange, clearFielderRow } = this.props

    if (!innings || !position || !options || !onChange) {
      return <LoadingOverlay />
    }

    // CR: Big filtering logic should live in state? make an options tree?
    let inningsArray = Array.from({ length: innings }, (v, k) => ++k)
    let cells = inningsArray.map(i => {
      return <FielderCell key={'fielder-cell-' + i}
        value={lineup[i][position]}
        inning={i}
        position={position}
        lockedInning={lockedInnings.indexOf(i) > -1}
        options={options.filter(o => o.value === lineup[i][position] || !Object.values(lineup[i]).includes(o.value))}
        onChange={onChange} />
    })


    return (
      <Table.Row>
        <Table.Cell>
          <Header as="h4">{ position }</Header>
          <Button data={position} circular icon='erase' onClick={clearFielderRow} />
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
  onChange: PropTypes.func.isRequired,
  clearFielderRow: PropTypes.func.isRequired
}
export default FielderRow
