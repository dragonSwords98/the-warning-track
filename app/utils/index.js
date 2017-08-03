'use strict'
import { BENCH_STATUS, IN_THE_HOLE_STATUS, ON_DECK_STATUS, AT_BAT_STATUS } from './constants'

export const objectToOption = function (data) {
  return data.map(d => {
    return {
      key: d._id,
      value: d._id,
      text: d.name ? d.name : d._id
    }
  })
}

/**
  * @param jumpStart: if the game has not begun, kick start the first batter
  */
export const populateStatusGrid = function (activeRosterLength, innings, leadoff=true) {
  let array = []
  let row = new Array(innings)
  row.fill(BENCH_STATUS)
  while (activeRosterLength--) array.push(row.slice())

  // CR: STEP 2: leadoff hitter should be 'at-bat'
  if (leadoff) {
    let firstInning = array[0]
    if (firstInning.length < 3) {
      console.error('Illegal roster size')
    }
    firstInning[0] = AT_BAT_STATUS
    firstInning[0].disabled = !firstInning[0].disabled
    firstInning[1] = ON_DECK_STATUS
    firstInning[2] = IN_THE_HOLE_STATUS
  }

  return array
}

export const populateScoresheet = function (innings) {
  return {
    runs: new Array(innings).fill(0),
    outs: new Array(innings).fill(0)
  }
}

/**
 *  runs: runs of that inning (modified by this method)
 *  score: score of that inning (modified by this method)
 *  statuses: the statuses of the batters of one team for inning id-ed by @param inning
 */
export const updateScoresheet = function (value, statuses) {
  let count = 0
  statuses.forEach(g => {
    if (g.name === value) {
      count++
    }
  })
  return count
}


export const mapLeaguesIntoTeams = function (teams, leagues) {
  return teams.map(t => {
    t.leagues = Object.assign([], t.leagues).map(tl => leagues.find(l => l._id === tl) ? leagues.find(l => l._id === tl) : tl)
    return t
  })
}

export const mapTeamsIntoPlayers = function (players, teams) {
  players = players.map(p => {
    p.teams = Object.assign([], p.teams).map(pt => teams.find(t => t._id === pt) ? teams.find(t => t._id === pt) : pt)
    return p
  })
  return players
}

/**
 * @param availableFielders: the roster and their potential positions
 * @param copiedFieldingLineup: the current shallow copy of fielding lineup with innings, will be modified and returned
 * @return: the new fielding lineup with algo applied 
 */
export const firstFindFirstApply = function(availableFielders, copiedFieldingLineup) {
  copiedFieldingLineup.forEach(inning => {
    Object.keys(inning).forEach(p => {
      let match = availableFielders.find(f => {
        return f.positions.includes(p)
      })
      if (match && !inning[p]) inning[p] = match.value

    })
  })
  return copiedFieldingLineup
}

// TODO: nonDupInInningFirstFindFirstApply, nonDupInInningLimitAcrossPositionFirstFindFirstApply, nonDupInInningLimitAcrossPositionFirstFindFirstApply