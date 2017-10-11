'use strict'
import React from 'react'
import { Table } from 'semantic-ui-react'

import CircularSelect from '@track/components/Game/CircularSelect'
import { CIRCULAR_SELECT_LAYERS } from '@track/utils/constants'

function BattersBox ({
    r,
    i,
    currentInning,
    locationStatus,
    hitStatus,
    onRadialSelect,
    toggleRadialSelect,
    isBatOpen,
    isHitOpen
  }) {

  let HitReport = <CircularSelect
                        key={`hit-inning-cs-${r}-${i}}`}
                        layer={CIRCULAR_SELECT_LAYERS.ourTeamHitReport}
                        row={r}
                        inning={i}
                        status={hitStatus}
                        isOpen={isHitOpen}
                        onSelect={onRadialSelect}
                        onToggle={toggleRadialSelect}
                        disabled={currentInning !== i} />

  let Location = <CircularSelect
                        key={`location-inning-cs-${r}-${i}}`}
                        layer={CIRCULAR_SELECT_LAYERS.ourTeamLocation}
                        row={r}
                        inning={i}
                        status={locationStatus}
                        isOpen={isBatOpen}
                        onSelect={onRadialSelect}
                        onToggle={toggleRadialSelect}
                        disabled={currentInning !== i} />

  return (
    <Table.Cell key={`inning-cell-${r}-${i}}`} className="batter-cell">
      { HitReport }
      { Location }
    </Table.Cell>
  )
}
export default BattersBox