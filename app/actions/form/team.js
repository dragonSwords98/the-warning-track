'use strict'
import { client } from '../client'

export function submitCreateTeamForm () {
  return function (dispatch, getState) {
    const state = getState()

    // 1. Validate the form now
    dispatch({ type: 'create-form.team/validate', payload: { team: state.team} })

    // 2. Is the form valid?
    if (!state.create.valid) {
      // 3. Show the user why its not valid TODO: Implement??
      return dispatch({ type: 'directory.create-team/invalid', payload: { team: state.create.invalidFields } })
    }

    // OR 3. save the valid team
    let promise
    promise = client.addTeam(state.team)
    dispatch({ type: 'create-form.team/submitted' })
    promise.then((data) => {
      dispatch({ type: 'create-form/destroy' })
      return dispatch({
        type: 'directory.create-team/success',
        payload: {
          _id: data._id,
          newTeam: state.team
        }
      }) // move new team to team directory, clear the team form
    }).catch((error) => {
      return dispatch({
        type: 'directory.create-team/rejected',
        payload: { error: error }
      })
    })
  }
}

export function updateCreateTeamForm (data) {
  return function (dispatch, getState) {
    // 1. Update the form
    dispatch({ type: 'directory.create-team/update', payload: { field: data['data-create-id'], value: data.value } })
    const state = getState()

    // 2. Is the form valid?
    return dispatch({ type: 'create-form.team/validate', payload: { team: state.team} })
  }
}
