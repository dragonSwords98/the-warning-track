'use strict'
import { client } from '../client'

export function submitCreatePlayerForm () {
  return function (dispatch, getState) {
    const state = getState()

    // 1. Validate the form now
    dispatch({ type: 'create-form.player/validate', payload: { player: state.player} })

    // 2. Is the form valid?
    if (!state.create.valid) {
      // 3. Show the user why its not valid TODO: Implement??
      return dispatch({ type: 'directory.create-player/invalid', payload: { player: state.create.invalidFields } })
    }

    // OR 3. save the valid player
    let promise
    promise = client.addPlayer(state.player)
    dispatch({ type: 'create-form.player/submitted' })
    promise.then((data) => {
      dispatch({ type: 'create-form/destroy' })
      return dispatch({
        type: 'directory.create-player/success',
        payload: {
          _id: data._id,
          newPlayer: state.player
        }
      }) // move new player to player directory, clear the player form
    }).catch((error) => {
      return dispatch({
        type: 'directory.create-player/rejected',
        payload: { error: error }
      })
    })
  }
}

export function updateCreatePlayerForm (event, data) {
  return function (dispatch, getState) {
    let field, value
    if (!data) {
      value = event
      field = 'jersey'
    } else if (!data.value) {
      // GENDER
      value = data.checked ? 1 : 0
      field = data['data-create-id']
    } else {
      value = data.value
      field = data['data-create-id']
    }

    // 1. Update the form
    dispatch({ type: 'directory.create-player/update', payload: { field: field, value: value } })
    const state = getState()

    // 2. Is the form valid?
    return dispatch({ type: 'create-form.player/validate', payload: { player: state.player } })
  }
}
