'use strict'
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router'

import { Menu, Header, Dropdown } from 'semantic-ui-react'
import { push as pushLocation } from 'react-router-redux'

import { initMenu, handleMenuItemAction, handleMenuSelectAction } from '@track/actions/navigation-actions'

class AppMenu extends Component {
  componentWillMount () {
    this.props.init()
  }

  render () {
    let { placeholder, activeFilter, activeItem, activeOptions } = this.props
    let menuRight
    if (activeFilter) {
      menuRight = (
        <Menu.Item position="right">
          <Dropdown placeholder={placeholder} search selection className="icon" options={activeOptions} onChange={this.props.handleMenuSelect} />
        </Menu.Item>
      )
    }
    return (
      <Menu>
        <Menu.Item>
          <Header as="h1">TRACK</Header>
        </Menu.Item>
        <Menu.Item name="teams" active={activeItem === 'teams'} onClick={this.props.handleMenuItem} />
        <Menu.Item name="players" active={activeItem === 'players'} onClick={this.props.handleMenuItem} />
        <Menu.Item name="games" active={activeItem === 'games'} onClick={this.props.handleMenuItem} />
        { menuRight }
      </Menu>
    )
  }
}
export default withRouter(connect(
  function mapStateToProps (state, ownProps) {
    return {
      activeItem: state.navigation.activeItem,
      activeFilter: state.navigation.activeFilter,
      activeOptions: state.navigation.activeOptions,
      placeholder: state.navigation.placeholder
    }
  },
  function mapDispatchToProps (dispatch, ownProps) {
    return {
      init () {
        dispatch(initMenu(ownProps.location.pathname))
      },
      handleMenuItem (e, data) {
        dispatch(pushLocation('/' + data.name))
        dispatch({ type: 'app-menu/clear-options' })
        dispatch(handleMenuItemAction(data.name))
      },
      handleMenuSelect (e, data) {
        dispatch(handleMenuSelectAction(data.value))
      }
    }
  }
)(AppMenu))
