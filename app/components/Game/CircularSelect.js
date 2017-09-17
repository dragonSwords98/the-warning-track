'use strict'
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Button } from 'semantic-ui-react'

import { STATUS_ORDERING } from '@track/utils/constants'
import { objectToOption } from '@track/utils'

class CircularSelect extends Component {
  render () {
    let { options, status, row, inning, isOpen, onToggle, onSelect, disabled } = this.props
    let groupClass = isOpen ? 'open circle' : 'circle'
    options = STATUS_ORDERING // TODO: move to state

    for(var i = 0, l = options.length; i < l; i++) {
      options[i].style = {}
      options[i].style.left = (40 - 50*Math.cos(-0.5 * Math.PI - 2*(1/l)*i*Math.PI)).toFixed(4) + "%";
      options[i].style.top = (40 + 40*Math.sin(-0.5 * Math.PI - 2*(1/l)*i*Math.PI)).toFixed(4) + "%";
    }
    
    return (
      <div className="circular-menu">
        <div className={groupClass}>
          {
            options.map(o => {
              return (
                <Button
                  style={o.style}
                  key={'cs' + o.name}
                  circular
                  color={o.color}
                  icon={o.icon}
                  data-label={o.name}
                  onClick={onSelect}
                  disabled={disabled}>
                  {o.label}
                </Button>)
            })
          }
        </div>
        <Button
          className="menu-button"
          data-row={row}
          data-inning={inning}
          circular
          icon={status.icon ? status.icon : 'bars'}
          onClick={onToggle} />
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