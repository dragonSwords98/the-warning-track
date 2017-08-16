'use strict'

import { client } from './client'
import { updateMenuFilter } from '@track/actions/navigation'

export function fetchAll () {
  return function (dispatch, getState) {
    let promise

    promise = client.getAllLeagues()
    promise.then((data) => {
      dispatch({ type: 'fetch-directory.leagues/received', payload: { leagues: data } })
      return client.getAllTeams()
    }).then((data) => {

      dispatch({ type: 'fetch-directory.teams/received', payload: { teams: data } })
      return client.getAllPlayers()
    }).then((data) => {

      dispatch({ type: 'fetch-directory.players/received', payload: { players: data } })
      return client.getAllGames()
    }).then((data) => {
      dispatch({ type: 'fetch-directory.games/received', payload: { games: data } })
      return client.getAllDiamonds()
    }).then((data) => {
      dispatch({ type: 'fetch-directory.diamonds/received', payload: { diamonds: data } })
      return
    }).then(() => {
      dispatch(updateMenuFilter())
    })
  }
}
