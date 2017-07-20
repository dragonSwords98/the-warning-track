'use strict'
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Table, Select } from 'semantic-ui-react'

import LoadingOverlay from '@track/components/LoadingOverlay'

class FielderCell extends Component {
  render () {
    const { value, inning, position, lockedInning, options, onChange } = this.props

    if (!inning || !position || !options) {
      return <LoadingOverlay />
    }

    if (lockedInning) {
      return (
        <Table.Cell>
          <Select
            fluid
            placeholder="Player"
            data-inning={inning}
            data-position={position}
            options={options}
            onChange={onChange}
            value={value}
            disabled />
        </Table.Cell>)
    }

    return (
      <Table.Cell>
        <Select
          fluid
          placeholder="Player"
          data-inning={inning}
          data-position={position}
          options={options}
          onChange={onChange}
          value={value} />
      </Table.Cell>)
  }
}
FielderCell.propTypes = {
  value: PropTypes.string,
  inning: PropTypes.number.isRequired,
  position: PropTypes.string.isRequired,
  lockedInning: PropTypes.bool,
  options: PropTypes.array.isRequired,
  onChange: PropTypes.func.isRequired
}
export default FielderCell
