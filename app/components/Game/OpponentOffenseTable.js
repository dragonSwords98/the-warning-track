'use strict'

import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Table, Header, Input, Button } from 'semantic-ui-react'

import { MINIMAL_BATTERS_COUNT, REALISTIC_MAX_BATTERS_COUNT } from '@track/utils/constants'
import OpponentBattersBox from './OpponentBattersBox'
import LoadingOverlay from '@track/components/LoadingOverlay'

class OpponentOffenseTable extends Component {

  render () {
    let {
      innings, currentInning,
      opposingBattingOrder, onChangeOpposingBattersCount,
      hitTypeOptions, depthOptions, laneOptions, toggleInningLock,
      onChangeOpponentName, onChangeOpponentNumber,
      onChangeHitType, onChangeDepth, onChangeLane
    } = this.props

    if (!opposingBattingOrder) {
      return <LoadingOverlay />
    }

    let i = 0
    let r = 0
    
    let BattingTableHeaderCells = (
      <Table.Row key={'batter-head'} >
        <Table.HeaderCell>{'Batting Report'}</Table.HeaderCell>
        {
          new Array(innings).fill().map((e,j)=>(<Table.HeaderCell key={r + 'inning-' + j}>{++j}</Table.HeaderCell>))
        }
      </Table.Row>
    )

    const BattingCells = opposingBattingOrder.map((o, i) => {
      return (<Table.Cell>
          <Input key={'name' + i} data-order={i} transparent placeholder='Name' value={o.name} onChange={onChangeOpponentName.bind(this)} />
          <Input key={'number' + i} data-order={i} transparent placeholder='Jersey' type='number' value={o.number} onChange={onChangeOpponentNumber.bind(this)} />
        </Table.Cell>)
    })

    const BattingRow = (r) => (
      <Table.Row key={'batter-' + r} >
        { BattingCells[r] }
        {
          new Array(innings).fill().map((e,j)=>(<Table.Cell key={r + 'inning-' + j}>
            <OpponentBattersBox
              row={r}
              inning={j} 
              disabled={currentInning - 1 !== j}
              hitTypeOptions={hitTypeOptions}
              depthOptions={depthOptions}
              laneOptions={laneOptions}
              onChangeHitType={onChangeHitType}
              onChangeDepth={onChangeDepth}
              onChangeLane={onChangeLane} />
          </Table.Cell>))
        }
      </Table.Row>
    )
    

    let BattingTable = new Array(opposingBattingOrder.length).fill().map((e,i)=>BattingRow(i++))

    let lockInnings = [<Table.Cell key={'footer-lock-0'}><Header as="h4">Completed</Header></Table.Cell>]
    for (let i = 1; i <= innings; i++) {
      let icon = currentInning === i ? 'checkmark' : 'lock'
      lockInnings.push(<Table.Cell key={'footer-lock-' + i}><Button data={i} circular icon={icon} onClick={toggleInningLock} /></Table.Cell>)
    }

    return (
      <div>
        <Button.Group>
          <Button disabled={opposingBattingOrder.length === MINIMAL_BATTERS_COUNT} icon='minus' onClick={onChangeOpposingBattersCount} />
          <Button disabled={opposingBattingOrder.length === REALISTIC_MAX_BATTERS_COUNT} icon='plus' onClick={onChangeOpposingBattersCount} />
        </Button.Group>
        <Table celled>
          <Table.Header>
            { BattingTableHeaderCells }
          </Table.Header>

          <Table.Body>
            { BattingTable }
          </Table.Body>

          <Table.Footer>
            <Table.Row>
              { lockInnings }
            </Table.Row>
          </Table.Footer>
        </Table>
      </div>
    )
  }
}
OpponentOffenseTable.propTypes = {
  innings: PropTypes.number.isRequired,
  currentInning: PropTypes.number.isRequired,
  opposingBattingOrder: PropTypes.array.isRequired,
  onChangeOpposingBattersCount: PropTypes.func.isRequired,
  toggleInningLock: PropTypes.func.isRequired
}
export default OpponentOffenseTable
