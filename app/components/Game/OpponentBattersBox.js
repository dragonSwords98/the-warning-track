'use strict'
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Dropdown } from 'semantic-ui-react'

import LoadingOverlay from '@track/components/LoadingOverlay'
import { correctKeyOptionWithId } from '@track/utils'

class OpponentBattersBox extends Component {
  render () {
    let {
      row, inning, disabled,
      hitTypeOptions, depthOptions, laneOptions,
      onChangeHitType, onChangeDepth, onChangeLane
    } = this.props

    if (!hitTypeOptions || !depthOptions || !laneOptions) {
      return <LoadingOverlay />
    }

      // TODO: there's a key children error with dropdowns
        // <Dropdown key={`depth-drop-${row}-${inning}`} placeholder='Select Depth' data-row={row} data-inning={inning} fluid search selection options={correctKeyOptionWithId(`${row}-${inning}-depth`, depthOptions)} disabled={disabled} onChange={onChangeDepth.bind(this)} />
        // <Dropdown key={`lane-drop-${row}-${inning}`} placeholder='Select Lane' data-row={row} data-inning={inning} fluid search selection options={correctKeyOptionWithId(`${row}-${inning}-lane`, laneOptions)} disabled={disabled} onChange={onChangeLane.bind(this)} />
    return (
      <div key={`opponent-box-${row}-${inning}`}>
        <Dropdown key={`hit-drop-${row}-${inning}`} placeholder='Select Hit Type' data-row={row} data-inning={inning} fluid search selection options={correctKeyOptionWithId(`${row}-${inning}-hit`, hitTypeOptions)} disabled={disabled} onChange={onChangeHitType.bind(this)} />
      </div>
    )
  }
}
OpponentBattersBox.propTypes = {
  row: PropTypes.number.isRequired,
  inning: PropTypes.number.isRequired,
  disabled: PropTypes.bool.isRequired,
  hitTypeOptions: PropTypes.array.isRequired,
  depthOptions: PropTypes.array.isRequired,
  laneOptions: PropTypes.array.isRequired,
  onChangeHitType: PropTypes.func.isRequired,
  onChangeDepth: PropTypes.func.isRequired,
  onChangeLane: PropTypes.func.isRequired
}
export default OpponentBattersBox
