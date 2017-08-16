'use strict'

import { objectToOption } from '@track/utils'

export function initMenu (locationPath) {
  return function (dispatch, getState) {
    dispatch({ type: 'app-menu/init', payload: { path: locationPath } })
  }
}

export function handleMenuItemAction (name) {
  return function (dispatch, getState) {

    // if (name === 'home') {
    //   dispatch(pushLocation('/games')) // TODO: work out the workflow for create game, schedule games
    // }
    dispatch({ type: 'app-menu/clear-select' })
    dispatch({ type: 'route.directory-list/toggle-create-form', payload: { hide: true } })
    dispatch({ type: 'create-form/destroy' })

    if (name === 'teams') {
      dispatch(getMenuSelectOptions(name, 'leagues'))
    }

    if (name === 'players') {
      dispatch(getMenuSelectOptions(name, 'teams'))
    }

    if (name === 'games') {
      dispatch(getMenuSelectOptions(name, 'leagues'))
    }
  }
}

export function handleMenuSelectAction (selection) {
  return function (dispatch, getState) {
    const state = getState()

    dispatch({
      type: 'app-menu/select-action',
      payload: { selection }
    })
  }
}

export function getMenuSelectOptions (name, filter) {
  return function (dispatch, getState) {
    const state = getState()
    dispatch({
      type: 'app-menu/item-action',
      payload: {
        name: name,
        filter: filter,
        options: objectToOption(Object.assign([], state.directory[filter]))
      }
    })
  }
}

export function updateMenuFilter () {
  return function (dispatch, getState) {
    const state = getState()
    if (state.navigation.activeFilter === 'leagues') return dispatch(getMenuSelectOptions(state.navigation.activeItem, 'leagues'))
    if (state.navigation.activeFilter === 'teams') return dispatch(getMenuSelectOptions(state.navigation.activeItem, 'teams'))
  }
}
