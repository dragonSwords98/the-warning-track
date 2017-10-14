'use strict'

import React, { Component } from 'react'
import { Table, Header, Input, Image, Button } from 'semantic-ui-react'

import { REALISTIC_MAX_BATTERS_COUNT, REALISTIC_MAX_AT_BATS_PER_GAME } from '@track/utils/constants'
import OpponentBattersBox from './OpponentBattersBox'
import LoadingOverlay from '@track/components/LoadingOverlay'

class OpponentOffenseTable extends Component {

  render () {
    let {
      innings, opponentBattingOrder, minimalBatters, opponentOrderTurned, onChangeOrderTurned,
      opponentBattingReport, onChangeOpposingBattersCount, onChangeOpponentName, onChangeOpponentNumber,
      onChangeDepth, onChangeLane, onChangeHitType, saveGame
    } = this.props

    if (!opponentBattingReport) {
      return <LoadingOverlay />
    }

    /* HEADER */
    let HeaderRow = null
    if (opponentOrderTurned > 1) {
      HeaderRow = new Array(opponentOrderTurned-1).fill().map((e,j)=>(<Table.HeaderCell key={'header-atBat-' + (++j)}>{++j}</Table.HeaderCell>))
    }

    let atBatFlag = opponentBattingReport.some(o => {
      let lastAtBat = o[o.length - 1]
      return lastAtBat.type !== null || lastAtBat.lane !== null || lastAtBat.depth !== null
    })
    let minusDisabledAtBats = opponentOrderTurned <= 1 || atBatFlag
    
    let BattingTableHeaderCells = (
      <Table.Row key={'batter-head'} >
        <Table.HeaderCell>{'Batting Report'}</Table.HeaderCell>
        {HeaderRow}
        {
          <Table.HeaderCell key={'header-atBat-0'}>
            <Button.Group>
              <Button label={{ as: 'a', basic: true, pointing: 'right', content: '# of At-Bats' }} labelPosition='left'
                disabled={minusDisabledAtBats} icon='minus' onClick={onChangeOrderTurned} />
              <Button label={{ as: 'a', basic: true, pointing: 'left', content: opponentOrderTurned }} labelPosition='right'
                disabled={opponentOrderTurned >= REALISTIC_MAX_AT_BATS_PER_GAME} icon='plus' onClick={onChangeOrderTurned} />
            </Button.Group>
          </Table.HeaderCell>
        }
      </Table.Row>
    )

    /* FIRST COLUMN */
    const BattingCells = opponentBattingOrder.map((o, i) => {
      return (<Table.Cell>
          <Header as='h4' image>
            <Image src='' shape='rounded' size='mini' />
            <Header.Content>
              <Input key={'name' + i} data-order={i} transparent placeholder='Name' value={o.name} onChange={onChangeOpponentName.bind(this)} />      
              <Header.Subheader><Input key={'number' + i} data-order={i} transparent placeholder='Jersey' type='number' min='0' max='99' value={o.number} onChange={onChangeOpponentNumber.bind(this)} /></Header.Subheader>
            </Header.Content>
          </Header>
        </Table.Cell>)
    })

    /* MAIN CONTENT */
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

    /* FOOTER */
    let FooterRow = null
    if (opponentOrderTurned > 1) {
      FooterRow = new Array(opponentOrderTurned-1).fill().map((e,j)=>(
        <Table.Cell key={'footer-atBat-' + (++j)}>{++j}</Table.Cell>)
      )
    }

    let BattingFooter = (
      <Table.Row key={'batter-head'} >
        <Table.HeaderCell></Table.HeaderCell>
        {FooterRow}
        <Table.Cell key={'footer-atBat-' + opponentOrderTurned}>
          <Button.Group>
            <Button label={{ as: 'a', basic: true, pointing: 'right', content: '# of At-Bats' }} labelPosition='left'
              disabled={minusDisabledAtBats} icon='minus' onClick={onChangeOrderTurned} />
            <Button label={{ as: 'a', basic: true, pointing: 'left', content: opponentOrderTurned }} labelPosition='right'
              disabled={opponentOrderTurned >= REALISTIC_MAX_AT_BATS_PER_GAME} icon='plus' onClick={onChangeOrderTurned} />
          </Button.Group>
        </Table.Cell>
      </Table.Row>
    )

    let batterFlag = opponentBattingReport[opponentBattingReport.length - 1].some(atBat => {
      return atBat.type !== null || atBat.lane !== null || atBat.depth !== null
    })
    let minusDisabledBatterCount = opponentBattingReport.length === minimalBatters || batterFlag

    return (
      <div>
        <Button.Group>
          <Button icon='save' color='green' onClick={saveGame} />
          <Button label={{ as: 'a', basic: true, pointing: 'right', content: '# of Batters' }} labelPosition='left'
            disabled={minusDisabledBatterCount} icon='minus' onClick={onChangeOpposingBattersCount} />
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
            { BattingFooter }
          </Table.Footer>
        </Table>
        <Button.Group>
          <Button label={{ as: 'a', basic: true, pointing: 'right', content: '# of Batters' }} labelPosition='left'
            disabled={minusDisabledBatterCount} icon='minus' onClick={onChangeOpposingBattersCount} />
          <Button disabled={opponentBattingReport.length >= REALISTIC_MAX_BATTERS_COUNT} icon='plus' onClick={onChangeOpposingBattersCount} />
        </Button.Group>
      </div>
    )
  }
}
export default OpponentOffenseTable
