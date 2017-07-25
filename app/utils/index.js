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
  let array = new Array(innings)
  array.fill([0, 0])
  return array
}