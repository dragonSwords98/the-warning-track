'use strict'
import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types'

import { List, Label } from 'semantic-ui-react'
import Sortable from 'sortablejs'


class SortableUnorderedList extends Component {
    componentDidMount () {
        let $this = $(ReactDOM.findDOMNode(this));
        let el = document.getElementById(this.props.id);
        let sortable = Sortable.create(el, {
            onUpdate: function (evt) {
                console.log(evt.target, evt.item)
                order = this.toArray()
                console.log('order', order)
            }
        });
    }

    render () {
        const { items, id } = this.props

        return (
            <List id={ id }>
                {
                    items.map(function(i) {
                        return (
                            <List.Item key={'list-item-' + i}>
                                <List.Content>
                                    <List.Header as='h4'><Label>{ i }</Label></List.Header>
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
    id:  PropTypes.string.isRequired,
    items: PropTypes.array.isRequired
}
export default SortableUnorderedList