'use strict'
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Button } from 'semantic-ui-react'

import LoadingOverlay from '@track/components/LoadingOverlay'

class BattersBox extends Component {
  render () {
    let { status, advanceRunner, row, inning, disabled } = this.props

    if (!status) {
      return <LoadingOverlay />
    }

    if (!advanceRunner || disabled) {
      return (
        <Button data-row={row} data-inning={inning} fluid color={status.color} disabled>{status.label}</Button>
      )
    }

    return (
      <Button data-row={row} data-inning={inning} fluid color={status.color} onClick={advanceRunner.bind(this)} >{status.label}</Button>
    )
  }
}
BattersBox.propTypes = {
  status: PropTypes.object.isRequired,
  advanceRunner: PropTypes.func.isRequired,
  disabled: PropTypes.bool.isRequired
}
export default BattersBox
