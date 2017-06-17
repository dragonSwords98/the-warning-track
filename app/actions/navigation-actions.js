'use strict'

import { push as pushLocation } from 'react-router-redux'

export function initMenu (locationPath) {
  return function (dispatch, getState) {
    dispatch({ type: 'app-menu/init', payload: { path: locationPath } })
  }
}

export function handleMenuItemAction (name) {
  return function (dispatch, getState) {
    dispatch({
      type: 'app-menu/item-action',
      payload: { name }
    })
    if (name === 'home') {
      dispatch(pushLocation('/creategame')) // TODO: work out the workflow for create game, schedule games
    }

    if (name === 'teams') {
      dispatch(pushLocation('/teams'))
    }

    if (name === 'players') {
      dispatch(pushLocation('/players'))
    }

    if (name === 'games') {
      dispatch(pushLocation('/games'))
    }
  }
}

export function handleMenuSelectAction (selection) {
  return function (dispatch, getState) {
    dispatch({
      type: 'app-menu/select-action',
      payload: { selection }
    })
  }
}
