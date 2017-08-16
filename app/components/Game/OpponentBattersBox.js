'use strict'
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Dropdown } from 'semantic-ui-react'

import LoadingOverlay from '@track/components/LoadingOverlay'

class OpponentBattersBox extends Component {
  render () {
    let {
      batter, row, inning, disabled,
      hitTypeOptions, depthOptions, laneOptions,
      onChangeHitType, onChangeDepth, onChangeLane
    } = this.props

    if (!hitTypeOptions || !depthOptions || !laneOptions) {
      return <LoadingOverlay />
    }

    return (
      <div key={`opponent-box-${row}-${inning}`}>
        <Dropdown key={`hit-drop-${row}-${inning}`} placeholder='Select Hit Type' data-order={row} data-inning={inning} fluid search selection options={hitTypeOptions} disabled={disabled} onChange={onChangeHitType.bind(this)} value={batter.type} />
        <Dropdown key={`depth-drop-${row}-${inning}`} placeholder='Select Depth' data-order={row} data-inning={inning} fluid search selection options={depthOptions} disabled={disabled} onChange={onChangeDepth.bind(this)} value={batter.depth} />
        <Dropdown key={`lane-drop-${row}-${inning}`} placeholder='Select Lane' data-order={row} data-inning={inning} fluid search selection options={laneOptions} disabled={disabled} onChange={onChangeLane.bind(this)} value={batter.lane} />
      </div>
    )
  }
}
OpponentBattersBox.propTypes = {
  batter: PropTypes.object.isRequired,
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
