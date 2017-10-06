'use strict'

import { client } from './client'
import { updateMenuFilter } from '@track/actions/navigation'
import { 
  updateAvailableLeagues,
  updateAvailableTeams,
  updateAvailableRoster,
  updateAvailableBatters,
  updateAvailableDiamonds
} from './form/game'

export function fetchAll () {
  return function (dispatch, getState) {
    let promise

    promise = client.getAllLeagues()
    promise.then((data) => {
      dispatch({ type: 'fetch-directory.leagues/received', payload: { leagues: data } })
      dispatch(updateAvailableLeagues())
      return client.getAllTeams()
    }).then((data) => {

      dispatch({ type: 'fetch-directory.teams/received', payload: { teams: data } })
      dispatch(updateAvailableTeams())
      return client.getAllPlayers()
    }).then((data) => {

      dispatch({ type: 'fetch-directory.players/received', payload: { players: data } })
      dispatch(updateAvailableRoster())
      return client.getAllGames()
    }).then((data) => {
      dispatch({ type: 'fetch-directory.games/received', payload: { games: data } })
      return client.getAllDiamonds()
    }).then((data) => {
      dispatch({ type: 'fetch-directory.diamonds/received', payload: { diamonds: data } })
      dispatch(updateAvailableDiamonds())
      return
    }).then(() => {
      dispatch(updateMenuFilter())
    })
  }
}
