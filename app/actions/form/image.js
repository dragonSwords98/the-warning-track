'use strict'
import { client } from '../client'

import { processImageToThumbnail } from '@track/utils'

export const uploadImage = function (type='player') {
  return function (dispatch, getState) {
    const state = getState()
    let image = state[type].image
    let imageData = state[type].imageData
    let promise

    if (!image || !imageData) {
      return
    }

    // TODO: should follow proper conventions for content-type
    // 'content-type': 'multipart/form-data' // default: 'application/x-www-form-urlencoded' or 'application/json'
    let query = {
      name: image.name,
      contentType: image.type,
      value: imageData
    }

    // 4. save the player's image
    // i. save the image, id it to this player, ensure the mongodb document matches this and return success, fail in all otherwises
    // ii. return a successful upload
    promise = client.uploadImage(query)
    dispatch({ type: 'upload.image/submitted' })
    promise.then((data) => {
      return dispatch({
        type: 'upload.image/success',
        payload: data
      })
    }).catch((error) => {
      return dispatch({
        type: 'upload.image/rejected',
        payload: error
      })
    })
  }
}


export const deleteImage = function (id) {
  return function (dispatch, getState) {
    const state = getState()
  }
}

export const handleImageSelect = function (files, type='player') {
  return function (dispatch, getState) {
    if (files.length != 1) {
      return dispatch({ type: 'image.upload/not-one-file'})
    }

    for (var i = 0, f; f = files[i]; i++) {
      // Only process image files.
      // Block large files (in btyes)
      if (!f.type.match('image.*')) {
        return dispatch({ type: 'image.upload/invalid-image'})
      }

      if (f.size > 1000000) {
        return dispatch({ type: 'image.upload/size-too-large'})
      }

      dispatch(processImageToThumbnail(f))

      let type = 'player' ? 'create-form.player/image-selected' : 'create-form.team/image-selected'
      return dispatch({ type: type, payload: { file: f } })
    }
  }
}