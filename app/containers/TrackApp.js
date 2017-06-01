import React, { Component } from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router'
import Promise from 'bluebird'
import routes from '../routes'

import Page from '@track/components/Page'
import AppMenu from '@track/components/AppMenu'
import Footer from '@track/components/Footer'

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
        menu={ <AppMenu /> }
        footerContent={ <Footer /> }>
        { routes }
      </Page>
    )
  }
}
export default withRouter(connect(
  function mapStateToProps (state, ownProps) {
    return state
  },
  function mapDispatchToProps (dispatch: (FSA) => *, ownProps) {
    return {
      init () {
        dispatch({ type: 'track/init', payload: {} })
      },
      destroy () {
        dispatch({ type: 'track/destroy', payload: {} })
      }
    }
  }
)(TrackApp))
