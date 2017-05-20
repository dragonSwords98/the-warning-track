import React, { Component } from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router'
// import { push as pushLocation } from 'react-router-redux'
class ManageableContainer extends Component {
  componentWillMount () {
    const { manageableType, manageableId } = this.props
    const { init } = this.props
    init(manageableType, manageableId)
  }
  componentWillReceiveProps (nextProps) {
    const thisType = this.props.manageableType
    const nextType = nextProps.manageableType
    const thisId = this.props.manageableId
    const nextId = nextProps.manageableId
    if (thisType !== nextType || thisId !== nextId) {
      this.props.destroy()
      this.props.init(nextType, nextId)
    }
  }
  componentWillUnmount () {
    this.props.destroy()
  }
  render () {
    const { children, maangeable, manageableId } = this.props
    if (!maangeable || maangeable.id !== manageableId) {
      return <div>Loading...</div>
    }
    return children
  }
}
export default withRouter(connect(
  function mapStateToProps (state, ownProps) {
    return {
      manageable: state.entities.manageable.current
    }
  },
  function mapDispatchToProps (dispatch, ownProps) {
    return {
      init (type, id) {
        dispatch({
          type: 'route.manageable-container/init',
          payload: {}
        })
        dispatch(fetchManageable(type, id)).catch(function (reason) {
          dispatch({
            type: 'route.manageable-container.fetchManageable/error',
            payload: reason
          })
          // dispatch(pushLocation('/'))
        })
      },
      destroy () {
        dispatch({
          type: 'route.manageable-container/destroy',
          payload: {}
        })
        dispatch({
          type: 'manageable/destroy',
          payload: {}
        })
      }
    }
  }
)(ManageableContainer))
