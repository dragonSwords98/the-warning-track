'use strict'
import React, { Component } from 'react'
import PropTypes from 'prop-types'

import { List, Label } from 'semantic-ui-react'
// TODO: https://github.com/clauderic/react-sortable-hoc

class SortableUnorderedList extends Component {
  render () {
    const { items, id } = this.props
    // item -> [text, gender]
    return (
      <List id={id}>
        {
          items.map(function (i) {
            return (
              <List.Item key={'list-item-' + i[0]} data-id={i[0]} data-gender={i[1] ? 1 : 0}>
                <List.Content>
                  <List.Header as="h4"><Label color={i[1] ? 'pink' : 'blue'}>{i[0] + ' | ' + i[2]}</Label></List.Header>
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
