'use strict'

import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Table, Dropdown, Button } from 'semantic-ui-react'

import { MINIMAL_BATTERS_COUNT, REALISTIC_MAX_BATTERS_COUNT } from '@track/utils/constants'

import LoadingOverlay from '@track/components/LoadingOverlay'

class OpponentOffenseTable extends Component {

  render () {
    let { innings, opposingBattingOrder, onChangeOpposingBattersCount } = this.props

    //if (!status) {
      // return <LoadingOverlay />
    //}

    let i = 0
    let r = 0
    
    let BattingTableHeaderCells = (
      <Table.Row key={'batter-head'} >
        <Table.HeaderCell>{'Batting Report'}</Table.HeaderCell>
        {
          new Array(innings).fill().map((e,j)=>(<Table.HeaderCell key={r + 'inning-' + j}>{j+1}</Table.HeaderCell>))
        }
      </Table.Row>
    )

    let BatterInfoCell = 'WHATS YOUR NAME'
    console.log('table.cell name + number doesnt work cuz it must be mapped')
    // const BattingRow = (r) => (
    //   <Table.Row key={'batter-' + r} >
    //     <Table.Cell>
    //       { opposingBattingOrder[r].name + ' ' + opposingBattingOrder[r].number } 
    //     </Table.Cell>
    //     {
    //       new Array(innings).fill().map((e,j)=>(<Table.Cell key={r + 'inning-' + j}>{j+1}</Table.Cell>))
    //     }
    //   </Table.Row>
    // )
    
    let BattingTable = new Array(opposingBattingOrder.length).fill().map((e,i)=>BattingRow(i+1))

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
            </Table.Row>
            <Table.Row>
            </Table.Row>
            <Table.Row>
            </Table.Row>
            <Table.Row>
            </Table.Row>
            <Table.Row>
            </Table.Row>
          </Table.Footer>
        </Table>
      </div>
    )
  }
}
OpponentOffenseTable.propTypes = {
  innings: PropTypes.number.isRequired,
  opposingBattingOrder: PropTypes.array.isRequired,
  onChangeOpposingBattersCount: PropTypes.func.isRequired
}
export default OpponentOffenseTable
