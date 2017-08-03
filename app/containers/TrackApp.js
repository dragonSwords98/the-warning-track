import React, { Component } from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router'
// import Promise from 'bluebird'
import routes from '../routes'

import Page from '@track/components/Page'
import AppMenu from '@track/components/AppMenu'
import Footer from '@track/components/Footer'
import LoadingOverlay from '@track/components/LoadingOverlay'

import { fetchAll } from '@track/actions/directory-actions'

class TrackApp extends Component {
  componentWillMount () {
    this.props.init()
  }
  componentWillUnmount () {
    this.props.destroy()
  }
  render () {
    const { directory } = this.props
    let content = (<LoadingOverlay msg={'Reticulating Splines...'} />)
    
    if (directory && directory.players && directory.teams && directory.games && directory.leagues) {
      content = routes
    }

    return (
      <Page
        className="track"
        menu={<AppMenu />}
        footerContent={<Footer />}>
        { content }
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
        dispatch(fetchAll())
      },
      destroy () {
        // dispatch({ type: 'track/destroy' })
      }
    }
  }
)(TrackApp))
