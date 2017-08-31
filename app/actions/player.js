'use strict'
import { client } from './client'

export function fetchPlayer (id) {
  return function (dispatch, getState) {
    const state = getState()
    if (state.directory.players) {
      let player = state.directory.players.find(p => p._id === id)
      if (player) {
        return dispatch({ type: 'fetch-player/received', payload: player })
      }
    }
    let promise = client.getPlayerById(id)
    return promise.then((data) => {
      return dispatch({ type: 'fetch-player/received', payload: { player: data } })
    }).catch((error) => {
      return dispatch({ type: 'route.player-container/no-such-player', payload: error })
    })
  }
}
