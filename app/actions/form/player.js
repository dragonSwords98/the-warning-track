'use strict'
import { client } from '../client'
import { uploadImage, handleImageSelect } from './image'

export function submitCreatePlayerForm () {
  return function (dispatch, getState) {
    const state = getState()

    // 1. Validate the form now
    dispatch({ type: 'create-form.player/validate', payload: { player: state.player} })

    // 2. Is the form valid?
    if (!state.create.valid) {
      // Show the user why its not valid TODO: Implement??
      return dispatch({ type: 'directory.create-player/invalid', payload: { player: state.create.invalidFields } })
    }

    // 3. save the valid player
    let promise
    let newPlayer = preparePlayerForm(Object.assign({}, state.player))
    promise = client.addPlayer(newPlayer)
    dispatch({ type: 'create-form.player/submitted' })
    
    promise.then((data) => {
      dispatch({ type: 'create-form/destroy' })
      return dispatch({
        type: 'directory.create-player/success',
        payload: {
          _id: data._id,
          newPlayer: newPlayer
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
    const state = getState()
    let field, value
    if (!data && event.target) {
      if (event.target.files) {
        return dispatch(handleImageSelect(event.target.files, 'player')) // no need to validate
      }
    } else if (!data) {
      value = event
      field = 'jersey'
    } else if (!data.value) {
      // GENDER
      value = data.checked ? 1 : 0
      field = data['data-create-id']
    } else if (data['data-create-id'] === 'image') {
      
    } else {
      value = data.value
      field = data['data-create-id']
    }

    // 1. Update the form
    dispatch({ type: 'directory.create-player/update', payload: { field: field, value: value } })

    // 2. Is the form valid?
    return dispatch({ type: 'create-form.player/validate', payload: { player: state.player } })
  }
}

function preparePlayerForm (player) {
  player.image = player.image.name
  player.imageData = undefined
  return player
}
