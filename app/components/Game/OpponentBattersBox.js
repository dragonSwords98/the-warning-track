'use strict'
import React, { Component } from 'react'
import PropTypes from 'prop-types'
// import { Dropdown } from 'semantic-ui-react'
import { Button } from 'semantic-ui-react'

import LoadingOverlay from '@track/components/LoadingOverlay'
import CircularSelect from '@track/components/Game/CircularSelect'
import { DEPTH_ORDERING, CIRCULAR_SELECT_LAYERS } from '@track/utils/constants'

class OpponentBattersBox extends Component {
  render () {
    // currentInning needed
    let {
      batter, row, inning, disabled,
      onRadialSelect, toggleRadialSelect,
      opposingBattingReport
      // hitTypeOptions, depthOptions, laneOptions,
      // onChangeHitType, onChangeDepth, onChangeLane
    } = this.props

    if (!hitTypeOptions || !depthOptions || !laneOptions) {
      return <LoadingOverlay />
    }

    let HitReportGroup = (
      <CircularSelect
        key={`hit-inning-cs-${row}-${inning}}`}
        layer={CIRCULAR_SELECT_LAYERS.opponentHitReport}
        row={row}
        inning={inning}
        status={opposingBattingReport.type}
        isOpen={}
        onSelect={onRadialSelect}
        onToggle={toggleRadialSelect}
        disabled={disabled} />)

    let LanesGroup = (
      <CircularSelect
        key={`location-inning-cs-${row}-${inning}}`}
        layer={CIRCULAR_SELECT_LAYERS.ourTeamLocation}
        row={row}
        inning={inning}
        status={opposingBattingReport.lane}
        isOpen={}
        onSelect={onRadialSelect}
        onToggle={toggleRadialSelect}
        disabled={disabled} />)

    let DepthButtons = []
    DEPTH_ORDERING.forEach(d => {
      if (d.min <= opposingBattingReport.depth && d.max >= opposingBattingReport.depth) {
        DepthButtons.push(
          <Button>TODO: You picked this</Button>
        )
      } else {
        DepthButtons.push(
          <Button key={`depth-order-${row}-${inning}-${d._id}`} data-row={row} data-inning={inning} data-min={d.min} data-max={d.max} onClick={onChangeDepth}>{d.name}</Button>
        )  
      }
    })

    let DepthsGroup = (
        <Button.Group vertical>
          {DepthButtons}
        </Button.Group>
    )
    // return (
    //   <div key={`opponent-box-${row}-${inning}`}>
    //     <Dropdown key={`hit-drop-${row}-${inning}`} placeholder='Select Hit Type' data-order={row} data-inning={inning} fluid search selection options={hitTypeOptions} disabled={disabled} onChange={onChangeHitType.bind(this)} value={batter.type} />
    //     <Dropdown key={`depth-drop-${row}-${inning}`} placeholder='Select Depth' data-order={row} data-inning={inning} fluid search selection options={depthOptions} disabled={disabled} onChange={onChangeDepth.bind(this)} value={batter.depth} />
    //     <Dropdown key={`lane-drop-${row}-${inning}`} placeholder='Select Lane' data-order={row} data-inning={inning} fluid search selection options={laneOptions} disabled={disabled} onChange={onChangeLane.bind(this)} value={batter.lane} />
    //   </div>
    // )

    return (
      <div key={`opponent-box-${row}-${inning}`}>
        { HitReportGroup }
        { LanesGroup }
        { DepthsGroup }
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
