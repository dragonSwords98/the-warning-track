'use strict'
import React, { Component } from 'react'
import PropTypes from 'prop-types'

import { List, Label } from 'semantic-ui-react'
// import Sortable from 'sortablejs' // TODO: Deprecate
// TODO: https://github.com/clauderic/react-sortable-hoc

class SortableList extends Component {
  render () {
    const { items, id } = this.props
    // item -> [text, gender]
    return (
      <List id={id}>
        {
          items.map(function (i) {
            return (
              <List.Item key={'list-item-' + i[0]} data-id={i[0]}>
                <List.Content>
                  <List.Header as="h4"><Label color={i[1] ? 'pink' : 'blue'}>{i[0]}</Label></List.Header>
                </List.Content>
              </List.Item>
            )
          })
        }
      </List>
    )
  }
}
SortableList.propTypes = {
  id: PropTypes.string.isRequired,
  items: PropTypes.array.isRequired,
  onChange: PropTypes.func.isRequired
}
export default SortableList

// import React, {Component} from 'react';
// import {render} from 'react-dom';
// import {SortableContainer, SortableElement, arrayMove} from 'react-sortable-hoc';

// const SortableItem = SortableElement(({value}) =>
//   <li>{value}</li>
// );

// const SortableList = SortableContainer(({items}) => {
//   return (
//     <ul>
//       {items.map((value, index) => (
//         <SortableItem key={`item-${index}`} index={index} value={value} />
//       ))}
//     </ul>
//   );
// });

// class SortableComponent extends Component {
//   onSortEnd = ({oldIndex, newIndex}) => {
//     this.setState({
//       items: arrayMove(this.state.items, oldIndex, newIndex),
//     });
//   };
//   render() {
//     const { items, id } = this.props
//     // item -> [text, gender]
//     return (
//       <List id={id}>
//         {
//           items.map(function (i) {
//             return (
//               <List.Item key={'list-item-' + i[0]} data-id={i[0]}>
//                 <List.Content>
//                   <List.Header as="h4"><Label color={i[1] ? 'pink' : 'blue' }>{ i[0] }</Label></List.Header>
//                 </List.Content>
//               </List.Item>
//             )
//           })
//         }
//       </List>
//     )

//     return <SortableList items={this.state.items} onSortEnd={this.onSortEnd} />;
//   }
// }
// SortableComponent.propTypes = {
//   id: PropTypes.string.isRequired,
//   items: PropTypes.array.isRequired,
//   onChange: PropTypes.func.isRequired
// }
