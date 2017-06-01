'use strict'

const teamList = [
  {
   id: 0,
   name: 'Looney Tunes',
   leadership: ['sling'],
   roster: ['bling', 'sling']
 },
 {
  id: 1,
  name: 'Bolders',
  leadership: ['clo'],
  roster: ['bling', 'sling', 'clo']
 }
]

export function fetchTeam(id) {
  return function (dispatch, getState) {
    const state = getState()
    dispatch({ type: 'fetch-team/received', payload: {
      team: teamList.filter(team => {
        return team.id === id
      })
    }})
  }
}
