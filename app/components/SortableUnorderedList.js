'use strict'
import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types'

import { List, Label } from 'semantic-ui-react'
import Sortable from 'sortablejs' // TODO: Deprecate

// TODO: https://github.com/clauderic/react-sortable-hoc

class SortableUnorderedList extends Component {
  componentDidMount () {
    const $this = $(ReactDOM.findDOMNode(this))
    const el = document.getElementById(this.props.id)
    const sortable = Sortable.create(el, {
      onUpdate: function (evt) {
        console.log(this.toArray(), evt.target, evt.item)
      }
    })
  }

  render () {
    const { items, id } = this.props
    return (
      <List id={id}>
        {
          items.map(function (i) {
            return (
              <List.Item key={'list-item-' + i} data-id={i}>
                <List.Content>
                  <List.Header as="h4"><Label>{ i }</Label></List.Header>
                </List.Content>
              </List.Item>
            )
          })
        }
      </List>
    )
  }
}
SortableUnorderedList.propTypes = {
  id: PropTypes.string.isRequired,
  items: PropTypes.array.isRequired,
  onChange: PropTypes.func.isRequired
}
export default SortableUnorderedList
