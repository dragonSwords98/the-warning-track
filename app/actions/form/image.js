'use strict'
import { client } from '../client'
import { processImageToThumbnail } from '@track/utils'

export const uploadImage = function (image) {
  return function (dispatch, getState) {
    const state = getState()
    let promise
    
    // TODO: this object and its uri should not be knowledgeable by actions, should all be in track-client.js
    let options = {
      method: 'POST',
      uri: 'localhost:8000/images', // TODO: haha, yeah, this is a problem
      formData: {
        name: state.image.name,
        file: {
          value: fs.createReadStream(__dirname + '/' + state.image.filename),
          options: {
            filename: state.image.filename,
            contentType: state.image.type
          }
        }
      },
      headers: {
        'content-type': 'multipart/form-data' // default: 'application/x-www-form-urlencoded'
      }
    }

    // 4. save the player's image
    // i. save the image, id it to this player, ensure the mongodb document matches this and return success, fail in all otherwises
    // ii. return a successful upload
    promise = client.uploadImage(options)
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