'use strict'
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Button } from 'semantic-ui-react'

import LoadingOverlay from '@track/components/LoadingOverlay'

class BattersBox extends Component {
  render () {
    let { status, hit, advanceRunner, changeHitType, row, inning, disabled } = this.props

    if (!status) {
      return <LoadingOverlay />
    }

    if (!advanceRunner || disabled) {
      return (
        <div>
          <Button data-row={row} data-inning={inning} fluid color={status.color} disabled>{status.label}</Button>
          <Button data-row={row} data-inning={inning} fluid color={hit.color} disabled>{hit.label}</Button>
        </div>
      )
    }

    return (
      <div>
        <Button data-row={row} data-inning={inning} fluid color={status.color} onClick={advanceRunner.bind(this)} >{status.label}</Button>
        <Button data-row={row} data-inning={inning} fluid color={hit.color} disabled={hit.disabled} onClick={changeHitType.bind(this)} >{hit.label}</Button>
      </div>
    )
  }
}
BattersBox.propTypes = {
  status: PropTypes.object.isRequired,
  advanceRunner: PropTypes.func.isRequired,
  disabled: PropTypes.bool
}
export default BattersBox
