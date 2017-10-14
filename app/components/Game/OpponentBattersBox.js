'use strict'
import React, { Component } from 'react'
import PropTypes from 'prop-types'
// import { Dropdown } from 'semantic-ui-react'
import { Button } from 'semantic-ui-react'

import LoadingOverlay from '@track/components/LoadingOverlay'
import CircularSelect from '@track/components/Game/CircularSelect'
import { HIT_ORDERING, LANE_ORDERING, DEPTH_ORDERING, CIRCULAR_SELECT_LAYERS } from '@track/utils/constants'

class OpponentBattersBox extends Component {
  render () {
    // currentInning needed
    let {
      batter, row, inning, disabled,
      batterReport,
      onChangeDepth, onChangeLane, onChangeHitType
    } = this.props

    let HitButtons = []
    HIT_ORDERING.forEach(h => {
      let active = false
      if (batterReport.type !== null) {
        active = batterReport.type === h._id
      }
      HitButtons.push(
        <Button
          size='mini'
          basic={!active}
          color={h.color}
          key={`depth-order-${row}-${inning}-${h._id}`}
          data-order={row}
          data-inning={inning}
          data-hit-type={h._id}
          onClick={onChangeHitType}>
          {h.name}
        </Button>)
    })

    let HitReportGroup = (
      <Button.Group vertical>
        {HitButtons}
      </Button.Group>
    )

    let LaneButtons = []
    LANE_ORDERING.forEach(l => {
      let active = false
      if (batterReport.lane !== null) {
        active = batterReport.lane === l._id
      }
      LaneButtons.push(
        <Button
          size='mini'
          basic={!active}
          color={l.color}
          key={`depth-order-${row}-${inning}-${l._id}`}
          data-order={row}
          data-inning={inning}
          data-lane={l._id}
          onClick={onChangeLane}>
          {l.name}
        </Button>)
    })

    let LanesGroup = (
      <Button.Group vertical>
        {LaneButtons}
      </Button.Group>
    )

    let DepthButtons = []
    DEPTH_ORDERING.forEach(d => {
      let active = false
      if (batterReport.depth !== null) {
        active = batterReport.depth[0] === d.min && batterReport.depth[1] === d.max
      }
      DepthButtons.push(
        <Button
          size='mini'
          basic={!active}
          color={d.color}
          key={`depth-order-${row}-${inning}-${d._id}`}
          data-order={row}
          data-inning={inning}
          data-min={d.min}
          data-max={d.max}
          active={active}
          onClick={onChangeDepth}>
          {d.name}
        </Button>)
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
export default OpponentBattersBox
