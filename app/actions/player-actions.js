'use strict'

const playerList = []

export function fetchPlayer (id) {
  return function (dispatch, getState) {
    dispatch({
      type: 'fetch-player/received',
      payload: {
        // team: playerList.filter(
        //   team => {
        //     return player.id === id
        //   }
        // )
      }
    })
  }
}
