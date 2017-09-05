'use strict'

export const objectToOption = function (data) {
  return data.map(d => {
    return {
      key: d._id,
      value: d._id,
      text: d.name ? d.name : d._id
    }
  })
}

export const populateGrid = function (activeRosterLength, innings, object) {
  let array = []
  let row = new Array(innings).fill().map(r => Object.assign({}, object))
  while (activeRosterLength--) array.push(row.slice())
  return array
}

export const populatePositions = function(positions) {
  return positions.reduce((acc, curr, i) => {
    acc[curr] = ''
    return acc
  }, {})
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

export const countFielders = function (roster, lineup) {
  let playerIds = {}
  roster.forEach(r => playerIds[r.key] = {
    count: 0,
    name: r.text
  })
  lineup.forEach(l => {
    Object.values(l).forEach(id => {
      playerIds[id].count++
    })
  })
  return playerIds
}

/**
 * @param availableFielders: the roster and their potential positions
 * @param copiedFieldingLineup: the current shallow copy of fielding lineup with innings, will be modified and returned
 * @return: the new fielding lineup with algo applied 
 */
export const firstUniqueFindFirstApply = function(availableFielders, copiedFieldingLineup) {
  let fielded = []
  copiedFieldingLineup.forEach(inning => {
    Object.keys(inning).forEach(p => {
      let match = availableFielders.find(f => {
        return f.positions.includes(p) && !fielded.includes(f)
      })
      if (match && !inning[p]) inning[p] = match.value
      if (match) fielded.push(match)
    })
  })
  return copiedFieldingLineup
}

/**
 * @param battingOrder: array of batting order [[player, gender], [player, gender], ...]
 * @param coedRule: rule for coed (currently only accepting 'MMF' or 'MMMF'), defaults to legal batting order
 * @return: false for legal batting order, true for illegal batting order
 */
export const validateBattingOrder = function (battingOrder, coedRule) {
  // CR: Hardcoded rules
  let rule = null
  if (coedRule === 'MMF') {
    rule = 2
  } else if (coedRule === 'MMMF') {
    rule = 3
  } else {
    return false
  }

  let batters = Object.assign([], battingOrder).concat(Object.assign([], battingOrder))
  let ruleCheck = rule
  for (let i = 0; i < batters.length - 1; i++) {
    if (ruleCheck < 1 && !batters[i][1]) {
      // Illegal male in order
      return true
    } else if (ruleCheck >= 1 && !batters[i][1]){
      // Legal male in order
      ruleCheck--
    } else {
      // Legal female in order
      ruleCheck = rule
    }
  }
  return false
}

// TODO: nonDupInInningFirstFindFirstApply, nonDupInInningLimitAcrossPositionFirstFindFirstApply, nonDupInInningLimitAcrossPositionFirstFindFirstApply