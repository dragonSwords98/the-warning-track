'use strict'
import { BENCH_STATUS } from './constants'

export const objectToOption = function (data) {
  return data.map(d => {
    return {
      key: d._id,
      value: d._id,
      text: d.name ? d.name : d._id
    }
  })
}

export const correctKeyOptionWithId = function (id, options) {
  return options.map(o => {
    return {
      key: `${o.key}-${id}`,
      value: o.value,
      text: o.text
    }
  })
}

export const populateStatusGrid = function (activeRosterLength, innings) {
  let array = []
  let row = new Array(innings)
  row.fill(BENCH_STATUS)
  while (activeRosterLength--) array.push(row.slice())
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

export const validateBattingOrder = function (battingOrder, coedRule) {
  // TODO: this way of checking order is incorrect and too strict. it is legal to have extra girls, it's just illegal to have 4 boys in a row!
  // be sure to check front and back of batting order too

  // SOLUTION: stack 2 copies of the batting order, check for 3 boys in a row or 4 boys in a row to invalidate MMF or MMMF
  // Automatically invalidate a roster that has ONLY F or ONLY M if there is a coed rule

  const order = coedRule.split('').map(char => char === 'F' ? 1 : 0) // Males are false 0, females are true 1
  let index = 0
  console.log(battingOrder, order, coedRule.split(''))
  for (let i = 0; i < battingOrder.length - 1; i++) {
    if (battingOrder[i][1] !== order[index]) {
      return false
    } else if (index > order.length - 1) {
      index = 0
    } else {
      index++
    }
  }
}

// TODO: nonDupInInningFirstFindFirstApply, nonDupInInningLimitAcrossPositionFirstFindFirstApply, nonDupInInningLimitAcrossPositionFirstFindFirstApply