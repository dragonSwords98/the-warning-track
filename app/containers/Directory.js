import React, { Component } from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router'

import LoadingOverlay from '@track/components/LoadingOverlay'
import CardGrid from '@track/components/CardGrid'
import { Header } from 'semantic-ui-react'


import { fetchDirectory } from '@track/actions/directory-actions'

class Directory extends Component {

  componentWillReceiveProps (nextProps) {
    if (!this.props.directory[nextProps.type]) {
      this.props.fetch(nextProps.type)
    }
  }
  componentWillMount () {
    const { init, type } = this.props
    init()
  }
  componentWillUnmount () {
    this.props.destroy()
  }
  render () {
    const { type, directory } = this.props
    if (!directory[type]) {
      return (<LoadingOverlay />)
    }

    return (
      <div>
        <Header as='h3'>{type.toUpperCase()}</Header>
        <CardGrid collection={directory[type]} type={type} />
      </div>
    )
  }
}
export default withRouter(connect(
  function mapStateToProps (state, ownProps) {
    return {
      directory: state.directory
    }
  },
  function mapDispatchToProps (dispatch, ownProps) {
    return {
      init() {
        dispatch({ type: 'route.directory-list/init' })
      },
      fetch(type) {
        dispatch({ type: 'route.directory-list/fetch' })
        dispatch(fetchDirectory(type))
      },
      destroy() {
        dispatch({ type: 'route.directory-list/destroy' })
      }
    }
  }
)(Directory))
