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
    let { navigation } = this.props
    let menuRight
    if (navigation.activeFilter) {
      menuRight = (
        <Menu.Item position="right">
          <Dropdown placeholder={navigation.placeholder} search selection className="icon" options={navigation.activeOptions} value={navigation.selectedOption} onChange={this.props.handleMenuSelect} />
        </Menu.Item>
      )
    }
    return (
      <Menu>
        <Menu.Item>
          <Header as="h1">TRACK</Header>
        </Menu.Item>
        <Menu.Item name="teams" active={navigation.activeItem === 'teams'} onClick={this.props.handleMenuItem} />
        <Menu.Item name="players" active={navigation.activeItem === 'players'} onClick={this.props.handleMenuItem} />
        <Menu.Item name="games" active={navigation.activeItem === 'games'} onClick={this.props.handleMenuItem} />
        { menuRight }
      </Menu>
    )
  }
}
export default withRouter(connect(
  function mapStateToProps (state, ownProps) {
    return {
      navigation: state.navigation
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
