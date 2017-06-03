'use strict'
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Button } from 'semantic-ui-react'

class BattersBox extends Component {
  render() {
    let { status, advanceBatter } = this.props

    if (!status) {
      return <div></div>
    }

    if (!advanceBatter) {
      return (
        <Button fluid color={status.color} disabled>{status.message}</Button>
      )
    }

    return (
      <Button fluid color={status.color} onClick={advanceBatter.bind(this)} >{status.label}</Button>
    )
  }
}
BattersBox.propTypes = {
  status: PropTypes.object.isRequired,
  advanceBatter: PropTypes.func.isRequired
}
export default BattersBox
