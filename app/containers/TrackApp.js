import React, { Component } from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router'
import Promise from 'bluebird'
import routes from '../routes'

import Page from '@track/components/Page'

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
        menu={<div>this will be a menu</div>}
        footerContent={<div>this will be a footer</div>}>
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
