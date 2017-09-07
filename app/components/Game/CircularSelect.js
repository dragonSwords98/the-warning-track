'use strict'
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Button } from 'semantic-ui-react'

import { STATUS_ORDERING } from '@track/utils/constants'
import { objectToOption } from '@track/utils'

class CircularSelect extends Component {
  render () {
    let { options, status, row, inning, openSelection, onSelection, disabled } = this.props

    options = STATUS_ORDERING

    return (
      <div>
        <div>
          {
            options.map(o => {
              return (
                <Button
                  key={'cs' + o.name}
                  data-row={row}
                  data-inning={inning}
                  circular
                  color={o.color}
                  icon={o.icon}
                  onClick={onSelection}
                  disabled={disabled} />)
            })
          }
        </div>
        <Button circular icon={status.icon ? status.icon : 'bars'} onClick={openSelection}/>
      </div>
    )
  }
}
CircularSelect.propTypes = {
  options: PropTypes.array.isRequired,
  status: PropTypes.object.isRequired,
  row: PropTypes.number.isRequired,
  inning: PropTypes.number.isRequired,
  disabled: PropTypes.bool
}
export default CircularSelect