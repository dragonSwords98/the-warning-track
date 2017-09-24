'use strict'
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Button } from 'semantic-ui-react'

import { objectToOption } from '@track/utils'

class CircularSelect extends Component {
  render () {
    let { layer, options, status, row, inning, isOpen, onToggle, onSelect, disabled } = this.props
    let groupClass = isOpen ? 'open circle' : 'circle'
    let circularOptions = ''
    options = layer.ordering // TODO: move to state


    if (isOpen) {
      for(var i = 0, l = options.length; i < l; i++) {
        options[i].style = {}
        // options[i].style.left = "calc(" + (80 - 240*Math.cos(-0.5 * Math.PI - 2*(1/l)*(-i+2.9)*51/100*Math.PI)).toFixed(4) + "% - 40px)"
        // options[i].style.top = "calc(" + (80 + 240*Math.sin(-0.5 * Math.PI - 2*(1/l)*(-i+2.9)*51/100*Math.PI)).toFixed(4) + "% - 40px)"
        options[i].style.left = "calc(" + (layer.layer)*(layer.dist - layer.deg*Math.cos(-0.5 * Math.PI - 2*(1/l)*(-i+layer.adjust)*layer.fraction*Math.PI)).toFixed(4) + "% - 40px)"
        options[i].style.top = "calc(" + (layer.layer)*(layer.dist + layer.deg*Math.sin(-0.5 * Math.PI - 2*(1/l)*(-i+layer.adjust)*layer.fraction*Math.PI)).toFixed(4) + "% - 40px)"
        options[i].style.border = layer.border
      }
    }

    let mainButton = (
      <Button
        className="menu-button"
        data-row={row}
        data-inning={inning}
        circular
        color={status.color}
        onClick={onToggle}>
        {status.label}
      </Button>
    )
    
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
                data-row={row}
                data-inning={inning}
                data-label={o.name}
                onClick={onSelect}
                disabled={disabled}>
                {o.label}
              </Button>)
          })
        }
        </div>
        {mainButton}
      </div>
    )
  }
}
CircularSelect.propTypes = {
  layer: PropTypes.object.isRequired,
  options: PropTypes.array.isRequired,
  status: PropTypes.object.isRequired,
  row: PropTypes.number.isRequired,
  inning: PropTypes.number.isRequired,
  disabled: PropTypes.bool
}
export default CircularSelect