'use strict'

import React, { Component } from 'react'
import { Table, Header, Input, Image, Button } from 'semantic-ui-react'

import { REALISTIC_MAX_BATTERS_COUNT, REALISTIC_MAX_AT_BATS_PER_GAME } from '@track/utils/constants'
import OpponentBattersBox from './OpponentBattersBox'
import LoadingOverlay from '@track/components/LoadingOverlay'

class OpponentOffenseTable extends Component {

  render () {
    let {
      innings, opponentBattingOrder, minimalBatters, opponentOrderTurned, 
       // currentInning,
      opponentBattingReport, onChangeOpposingBattersCount,
      // toggleInningLock,
      onChangeOpponentName, onChangeOpponentNumber,
      onChangeDepth, onChangeLane, onChangeHitType
    } = this.props

    if (!opponentBattingReport) {
      return <LoadingOverlay />
    }

    console.log(opponentBattingReport, opponentBattingOrder, opponentOrderTurned)



    let i = 0
    let r = 0
    let HeaderRow = null
    if (opponentOrderTurned > 1) {
      HeaderRow = new Array(opponentOrderTurned-1).fill().map((e,j)=>(<Table.HeaderCell key={r + 'inning-' + j}>{++j}</Table.HeaderCell>))
    }

    let minusDisabled = opponentOrderTurned <= 1 // and also if the report contains info, it cannot be deleted
    // CR: state should also check opponentOrderTurned >= REALISTIC_MAX_AT_BATS_PER_GAME
    let onChangeOrderTurned = null
    
    let BattingTableHeaderCells = (
      <Table.Row key={'batter-head'} >
        <Table.HeaderCell>{'Batting Report'}</Table.HeaderCell>
        {HeaderRow}
        {
          <Table.HeaderCell key={r + 'inning-' + opponentOrderTurned}>
            {opponentOrderTurned}
            <Button.Group>
              <Button disabled={minusDisabled} icon='minus' onClick={onChangeOrderTurned} />
              <Button disabled={opponentOrderTurned >= REALISTIC_MAX_AT_BATS_PER_GAME} icon='plus' onClick={onChangeOrderTurned} />
            </Button.Group>
          </Table.HeaderCell>
        }
      </Table.Row>
    )

    const BattingCells = opponentBattingOrder.map((o, i) => {
      return (<Table.Cell>
          <Header as='h4' image>
            <Image src='' shape='rounded' size='mini' />
            <Header.Content>
              <Input key={'name' + i} data-order={i} transparent placeholder='Name' value={o.name} onChange={onChangeOpponentName.bind(this)} />      
              <Header.Subheader><Input key={'number' + i} data-order={i} transparent placeholder='Jersey' type='number' value={o.number} onChange={onChangeOpponentNumber.bind(this)} /></Header.Subheader>
            </Header.Content>
          </Header>
        </Table.Cell>)
    })

    // TODO: only the batter's next or current hit cell should be enabled
    const BattingRow = (r, batter, batterReport) => (
      <Table.Row key={'batter-' + r} >
        { BattingCells[r] }
        {
          new Array(batterReport.length).fill().map((e,j)=>(<Table.Cell key={r + 'inning-' + j}>
            <OpponentBattersBox
              batter={batter}
              row={r}
              inning={j} 
              disabled={false}
              batterReport={batterReport[j]}
              onChangeHitType={onChangeHitType}
              onChangeLane={onChangeLane}
              onChangeDepth={onChangeDepth}
               />
          </Table.Cell>))
        }
      </Table.Row>
    )
    
    let BattingTable = new Array(opponentBattingReport.length).fill().map((e,r)=>BattingRow(r, opponentBattingOrder[r], opponentBattingReport[r]))

    // let lockInnings = [<Table.Cell key={'footer-lock-0'}><Header as="h4">Completed</Header></Table.Cell>]
    // for (let i = 1; i <= innings; i++) {
    //   let icon = currentInning === i ? 'checkmark' : 'lock'
    //   lockInnings.push(<Table.Cell key={'footer-lock-' + i}><Button data={i} circular icon={icon} onClick={toggleInningLock} /></Table.Cell>)
    // }
    let BattingFooter = ''

    return (
      <div>
        <Button.Group>
          <Button label={{ as: 'a', basic: true, pointing: 'right', content: '# of Batters' }} labelPosition='left'
            disabled={opponentBattingReport.length === minimalBatters} icon='minus' onClick={onChangeOpposingBattersCount} />
          <Button disabled={opponentBattingReport.length === REALISTIC_MAX_BATTERS_COUNT} icon='plus' onClick={onChangeOpposingBattersCount} />
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
        <Button.Group>
          <Button label={{ as: 'a', basic: true, pointing: 'right', content: '# of Batters' }} labelPosition='left'
            disabled={opponentBattingReport.length === minimalBatters} icon='minus' onClick={onChangeOpposingBattersCount} />
          <Button disabled={opponentBattingReport.length === REALISTIC_MAX_BATTERS_COUNT} icon='plus' onClick={onChangeOpposingBattersCount} />
        </Button.Group>
      </div>
    )
  }
}
export default OpponentOffenseTable
