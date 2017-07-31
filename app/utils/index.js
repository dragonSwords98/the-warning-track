'use strict'
import { BENCH_STATUS } from './constants'

export const objectToOption = function (data) {
  return data.map(d => {
    return {
      key: d._id,
      value: d._id,
      text: d.name
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