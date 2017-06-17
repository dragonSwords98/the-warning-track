import React, { Component } from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router'
// import Promise from 'bluebird'
import routes from '../routes'

import Page from '@track/components/Page'
import AppMenu from '@track/components/AppMenu'
import Footer from '@track/components/Footer'

import { fetchDirectory } from '@track/actions/directory-actions'

class TrackApp extends Component {
  componentWillMount () {
    this.props.init()
  }
  componentWillUnmount () {
    this.props.destroy()
  }
  render () {
    return (
      <Page
        className="track"
        menu={<AppMenu />}
        footerContent={<Footer />}>
        { routes }
      </Page>
    )
  }
}
export default withRouter(connect(
  function mapStateToProps (state, ownProps) {
    return state
  },
  function mapDispatchToProps (dispatch, ownProps) {
    return {
      init () {
        // dispatch({ type: 'track/init' })
        dispatch({ type: 'directory-list/init' })
        dispatch(fetchDirectory('players'))
        dispatch(fetchDirectory('teams'))
        dispatch(fetchDirectory('games'))
        dispatch(fetchDirectory('leagues'))
        dispatch(fetchDirectory('diamonds'))
      },
      destroy () {
        // dispatch({ type: 'track/destroy' })
      }
    }
  }
)(TrackApp))
