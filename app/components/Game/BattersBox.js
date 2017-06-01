'use strict'
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Button } from 'semantic-ui-react'

class BattersBox extends Component {

  // advanceBatter () {
  //   let { state } = this

  //   console.log(state)

  //   const BASE_STATE = ['Hole', 'Deck', 'At Bat', '1st', '2nd', '3rd', 'Home', 'Out']
  //   const COLOR_STATE = ['yellow', 'orange', 'red', 'olive', 'green', 'teal', 'blue', 'black']

  //   let baseStateId = COLOR_STATE.indexOf(state.color)
  //   if (++baseStateId >= COLOR_STATE.length) {
  //     baseStateId = 0
  //   }
  //   state.color = COLOR_STATE[baseStateId]
  //   state.message = BASE_STATE[baseStateId]
  //   this.forceUpdate()
  // }
  //this.advanceBatter.bind(this)

  componentWillMount () {
    // this.state = this.props.state
  }

  // componentWillReceiveProps (nextProps) {
    // this.state = nextProps.state
  // }

  render() {
    let { status, handleEvent } = this.props

    if (!handleEvent) {
      return (
        <Button fluid color={status.color} disabled>{status.message}</Button>
      )
    }

    return (
      <Button fluid color={status.color} onClick={handleEvent} >{status.label}</Button>
    )
  }
}
BattersBox.propTypes = {
  status: PropTypes.object.isRequired,
  handleEvent: PropTypes.func.isRequired
}
export default BattersBox
