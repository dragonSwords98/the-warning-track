'use strict'

import React, { Component } from 'react'
import { Table, Header, Input, Button } from 'semantic-ui-react'

import { MINIMAL_BATTERS_COUNT, REALISTIC_MAX_BATTERS_COUNT } from '@track/utils/constants'
import OpponentBattersBox from './OpponentBattersBox'
import LoadingOverlay from '@track/components/LoadingOverlay'

class OpponentOffenseTable extends Component {

  render () {
    let {
      innings,
       // currentInning,
      opposingBattingReport, onChangeOpposingBattersCount,
      onRadialSelect, toggleRadialSelect,
      // toggleInningLock,
      onChangeOpponentName, onChangeOpponentNumber,
      onChangeDepth, onChangeLane, onChangeHitType
    } = this.props

    if (!opposingBattingReport) {
      return <LoadingOverlay />
    }

    let i = 0
    let r = 0
    
    let BattingTableHeaderCells = (
      <Table.Row key={'batter-head'} >
        <Table.HeaderCell>{'Batting Report'}</Table.HeaderCell>
        {
          new Array(opposingBattingReport[0].atBats.length).fill().map((e,j)=>(<Table.HeaderCell key={r + 'inning-' + j}>{++j}</Table.HeaderCell>))
        }
      </Table.Row>
    )

    const BattingCells = opposingBattingReport.map((o, i) => {
      return (<Table.Cell>
          <Input key={'name' + i} data-order={i} transparent placeholder='Name' value={o.name} onChange={onChangeOpponentName.bind(this)} />
          <Input key={'number' + i} data-order={i} transparent placeholder='Jersey' type='number' value={o.number} onChange={onChangeOpponentNumber.bind(this)} />
        </Table.Cell>)
    })

    // TODO: only the batter's next or current hit cell should be enabled
    const BattingRow = (r, batter) => (
      <Table.Row key={'batter-' + r} >
        { BattingCells[r] }
        {
          new Array(opposingBattingReport[r].atBats.length).fill().map((e,j)=>(<Table.Cell key={r + 'inning-' + j}>
            <OpponentBattersBox
              batter={batter.atBats[j]}
              row={r}
              inning={j} 
              disabled={false}
              opposingBatterReport={opposingBattingReport[r].atBats[j]}
              onRadialSelect={onRadialSelect}
              toggleRadialSelect={toggleRadialSelect}
              onChangeHitType={onChangeHitType}
              onChangeLane={onChangeLane}
              onChangeDepth={onChangeDepth}
               />
          </Table.Cell>))
        }
      </Table.Row>
    )
    
    let BattingTable = new Array(opposingBattingReport.length).fill().map((e,i)=>BattingRow(i++, opposingBattingReport[i - 1]))

    // let lockInnings = [<Table.Cell key={'footer-lock-0'}><Header as="h4">Completed</Header></Table.Cell>]
    // for (let i = 1; i <= innings; i++) {
    //   let icon = currentInning === i ? 'checkmark' : 'lock'
    //   lockInnings.push(<Table.Cell key={'footer-lock-' + i}><Button data={i} circular icon={icon} onClick={toggleInningLock} /></Table.Cell>)
    // }
    let BattingFooter = ''

    return (
      <div>
        <Button.Group>
          <Button disabled={opposingBattingReport.length === MINIMAL_BATTERS_COUNT} icon='minus' onClick={onChangeOpposingBattersCount} />
          <Button disabled={opposingBattingReport.length === REALISTIC_MAX_BATTERS_COUNT} icon='plus' onClick={onChangeOpposingBattersCount} />
        </Button.Group>
        <Table collapsing basic='very'>
          <Table.Header>
            { BattingTableHeaderCells }
          </Table.Header>

          <Table.Body>
            { BattingTable }
          </Table.Body>

          <Table.Footer>
            <Table.Row>
              { BattingFooter }
            </Table.Row>
          </Table.Footer>
        </Table>
      </div>
    )
  }
}
export default OpponentOffenseTable
