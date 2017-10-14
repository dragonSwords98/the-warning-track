'use strict'
import moment from 'moment'

import { STATUS_ORDERING, HIT_ORDERING, LANE_ORDERING, GENERIC_OPPOSING_BATTER, GENERIC_ATBAT } from '@track/utils/constants'
import { populatePositions, populateScoresheet, populateGrid, updateScoresheet } from '@track/utils'

// The roster and batting order is virtually immutable after set as it will mess up the stats
// TODO: Must accommodate for substitutions
const INITIAL_STATE = {
  league: null,
  _id: null,
  ourTeam: null,
  opposingTeam: '',
  diamond: null,
  dateTime: moment().format('YYYY-MM-DD'),
  homeOrAway: 'Away', // or 'Home'
  currentInning: 1, // to emphasis specific off/def lineups
  lockedInnings: [],
  currentFrame: 0, // 0 for top, 1 for bottom
  ourBattingOrder: [],
  ourFieldingLineup: [],
  opponentBattingOrder: [],
  opponentBattingReport: [],
  opponentOrderTurned: 1,
  statusGrid: [], // ours batting order
  baseRadialActive: [-1, -1],
  hitRadialActive: [-1, -1],
  opposingHitRadialActive: [-1, -1],
  opposingLaneRadialActive: [-1, -1],
  hitGrid: [], // ours hitting chart
  scoresheet: [], // ours vs theirs
  prompt: null,
  status: 0 // =pre-game/in-game, 1 = post-game
}

// Future features: Pinch runner, designated pinch runner, scouting reports on hits
// Rotating co-ed roles
export default function gameReducers (state = INITIAL_STATE, action) {
  if (action.type === 'route.game-container/init') {
    state = Object.assign({}, state, INITIAL_STATE)
  }

  if (action.type === 'route.game-container/destroy') {
    state = Object.assign({}, state, INITIAL_STATE)
  }

  if (action.type === 'route.game-container/load-game.success') {
    state = Object.assign({}, INITIAL_STATE, state, action.payload.game)
  }
  
  if (action.type === 'route.game-container/load-league.success') {
    state = Object.assign({}, state)
    state.league = action.payload.league
    let minimalRoster = state.league.minimalRoster
    while (state.opponentBattingOrder.length < minimalRoster) {
      state.opponentBattingOrder.push(Object.assign({}, GENERIC_OPPOSING_BATTER))
    }
    state.opponentBattingReport.forEach(batter => {
      if (batter.length > state.opponentOrderTurned) state.opponentOrderTurned = batter.length
    })
    while (state.opponentBattingReport.length < minimalRoster) {
      state.opponentBattingReport.push(new Array(state.opponentOrderTurned).fill().map(b => Object.assign({}, GENERIC_ATBAT)))
    }
    console.log('league-success', state.opponentBattingReport, state.opponentBattingOrder)
  }

  if (action.type === 'route.game-container/load-game.rejected') {
    state = Object.assign({}, state, INITIAL_STATE)
  }

  /* Radial Selection for Offense Table -> Batter Box */

  if (action.type === 'game.radial-select/toggle') {
    state = Object.assign({}, state)

    if (!state.hitRadialActive) {
      state.hitRadialActive = [action.payload.data["data-inning"], action.payload.data["data-row"]]
    } else if (state.hitRadialActive[0] === action.payload.data["data-inning"] && state.hitRadialActive[0] === action.payload.data["data-row"]) {
      state.hitRadialActive = [-1, -1]
    } else {
      state.hitRadialActive = [action.payload.data["data-inning"], action.payload.data["data-row"]]
    }

    if (!state.baseRadialActive) {
      state.baseRadialActive = [action.payload.data["data-inning"], action.payload.data["data-row"]]
    } else if (state.baseRadialActive[0] === action.payload.data["data-inning"] && state.baseRadialActive[0] === action.payload.data["data-row"]) {
      state.baseRadialActive = [-1, -1]
    } else {
      state.baseRadialActive = [action.payload.data["data-inning"], action.payload.data["data-row"]]
    }
  }

  if (action.type === 'game.opposing-radial-select/toggle') {
    state = Object.assign({}, state)

    if (!state.opposingHitRadialActive) {
      state.opposingHitRadialActive = [action.payload.data["data-inning"], action.payload.data["data-row"]]
    } else if (state.opposingHitRadialActive[0] === action.payload.data["data-inning"] && state.opposingHitRadialActive[0] === action.payload.data["data-row"]) {
      state.opposingHitRadialActive = [-1, -1]
    } else {
      state.opposingHitRadialActive = [action.payload.data["data-inning"], action.payload.data["data-row"]]
    }

    if (!state.opposingLaneRadialActive) {
      state.opposingLaneRadialActive = [action.payload.data["data-inning"], action.payload.data["data-row"]]
    } else if (state.opposingLaneRadialActive[0] === action.payload.data["data-inning"] && state.opposingLaneRadialActive[0] === action.payload.data["data-row"]) {
      state.opposingLaneRadialActive = [-1, -1]
    } else {
      state.opposingLaneRadialActive = [action.payload.data["data-inning"], action.payload.data["data-row"]]
    }
  }

  if (action.type === 'game.radial-select/select') {
    let inning = action.payload.data['data-inning']
    let row = action.payload.data['data-row']
    let label = action.payload.data['data-label']
    let layer = action.payload.data['data-layer']

    state = Object.assign({}, state)

    if (layer === 'status') {
      let statusIndex = STATUS_ORDERING.findIndex(status => status.name === label)
      state.statusGrid[inning][row] = Object.assign({}, STATUS_ORDERING[statusIndex])

      state.scoresheet.ours.runs[inning] = updateScoresheet('HOME', state.statusGrid[inning])
      state.scoresheet.ours.outs[inning] = updateScoresheet('OUT', state.statusGrid[inning])
      state.baseRadialActive = [-1, -1]
    }
    if (layer === 'hit') {
      let hitIndex = HIT_ORDERING.findIndex(hit => hit.name === label)
      state.hitGrid[inning][row] = Object.assign({}, HIT_ORDERING[hitIndex])
      state.hitRadialActive = [-1, -1]
    }
  }

  if (action.type === 'game.scoresheet/update') {
    state = Object.assign({}, state)

    // TODO: Please confirm the OUTS are working reasonably properly

    if (action.payload.data.type === 'number') {
      state.scoresheet.theirs.runs[parseInt(action.payload.data["data-inning"])] = parseInt(action.payload.data.value)
    } else if (action.payload.data.type === 'checkbox' && action.payload.data.checked) {
      state.scoresheet.theirs.outs[parseInt(action.payload.data["data-inning"])]++
    } else if (action.payload.data.type === 'checkbox' && !action.payload.data.checked) {
      state.scoresheet.theirs.outs[parseInt(action.payload.data["data-inning"])]--
    } else {
      console.error('Unhandled scoresheet input type:', action.payload.data.type)
    }
  }

  if (action.type === 'create-game/init') {
    state = Object.assign({}, state)
    state.league = action.payload.league
  }

  if (action.type === 'create-game.select-league/set') {
    state = Object.assign({}, state)
    state.league = action.payload.league
    if (!action.payload.isOurTeamInThisLeague) {
      state.ourTeam = null
    }
    let positions = populatePositions(action.payload.league.positions)
    state.ourFieldingLineup = new Array(action.payload.league.innings).fill(positions)
  }

  if (action.type === 'create-game.select-diamond/set') {
    state = Object.assign({}, state)
    state.diamond = action.payload.diamond._id
  }

  if (action.type === 'create-game.home-or-away/set') {
    state = Object.assign({}, state)
    state.homeOrAway = action.payload.isHome ? 'Home' : 'Away'
  }

  if (action.type === 'create-game.form/update') {
    state = Object.assign({}, state)
    state[action.payload.field] = action.payload.value
  }

  if (action.type === 'create-game.form/populate-options') {
    if (action.payload.type === 'batters') {
      state = Object.assign({}, state)
      state.ourBattingOrder = action.payload.options
    }
  }

  if (action.type === 'create-game.batting-order/change') {
    state = Object.assign({}, state)
    state.ourBattingOrder = action.payload.newOrder
  }

  if (action.type === 'create-game.fielding-lineup/change') {
    state = Object.assign({}, state)
    // Design: Updates fielder for the current inning & position
    state.ourFieldingLineup[action.payload.inning] = Object.assign({}, state.ourFieldingLineup[action.payload.inning], {
      [action.payload.position]: action.payload.value
    })

    // Design: Smart-updates fielder to the entire row for the same position every inning
    // under two conditions. (1) There is no value already there; (2) The inning does not contain the fielder already
    state.ourFieldingLineup = state.ourFieldingLineup.map(i => {
      if (!i[action.payload.position] && !Object.values(i).includes(action.payload.value)) {
        i[action.payload.position] = action.payload.value
      }
      return i
    })
  }

  if (action.type === 'create-game.form/evaluate-active-roster') {
    state = Object.assign({}, state)
    state.ourFieldingLineup.forEach(inning => {
      Object.keys(inning).forEach(pos => {
        if (inning[pos] && !action.payload.selectedPlayers.includes(inning[pos])) {
          console.warn('found missing ' + inning[pos])
          inning[pos] = ''
        }
      })
    })
  }

  if (action.type === 'create-game.lock-inning/toggle') {
    state = Object.assign({}, state)
    let index = state.lockedInnings.indexOf(action.payload.inning)
    if (index > -1) {
      state.lockedInnings.splice(index, 1)
    } else {
      state.lockedInnings.push(action.payload.inning)
      state.lockedInnings.sort()
    }
  }

  if (action.type === 'create-game.fielder-row/clear') {
    state = Object.assign({}, state)
    state.ourFieldingLineup.forEach(inning => {
      inning[action.payload.position] = ""
    })
  }

  if (action.type === 'create-game.fielder-inning/clear') {
    state = Object.assign({}, state)
    state.ourFieldingLineup[action.payload.inning] = populatePositions(state.league.positions)
  }

  if (action.type === 'create-game.fielder-all/clear') {
    state = Object.assign({}, state)
    let positions = populatePositions(state.league.positions)
    state.ourFieldingLineup = new Array(state.league.innings).fill(positions)
  }

  if (action.type === 'create-game.fielder-all/fill') {
    state = Object.assign({}, state)
    state.ourFieldingLineup = action.payload.fieldingLineup
  }

  if (action.type === 'route.game-container/create-game.rejected') {
    console.error(action.payload)
  }

  if (action.type === 'game.lock-inning/toggle') {
    state = Object.assign({}, state)
    if (action.payload.inning === state.currentInning && state.currentInning <= state.league.innings - 1) {
      state.currentInning++
    } else if (action.payload.inning === state.currentInning) {
      state.currentInning = 1
    } else {
      state.currentInning = action.payload.inning
    }
  }

  if (action.type === 'game.opponent-name/change') {
    state = Object.assign({}, state)
    state.opponentBattingOrder = Object.assign([], state.opponentBattingOrder)
    state.opponentBattingOrder[action.payload.data['data-order']].name = action.payload.data.value
  }

  if (action.type === 'game.opponent-number/change') {
    state = Object.assign({}, state)
    state.opponentBattingOrder[action.payload.data['data-order']].number = parseInt(action.payload.data.value)
  }

  if (action.type === 'game.opponent-batter/change-hit-type') {
    state = Object.assign({}, state)
    state.opponentBattingReport = Object.assign([], state.opponentBattingReport)
    let hitType = state.opponentBattingReport[action.payload.data['data-order']][action.payload.data['data-inning']].type
    if (hitType === null) { // nothing selected
      state.opponentBattingReport[action.payload.data['data-order']][action.payload.data['data-inning']] = Object.assign({}, state.opponentBattingReport[action.payload.data['data-order']][action.payload.data['data-inning']], { type: action.payload.data['data-hit-type'] })
    } else if (hitType === action.payload.data['data-hit-type']) { // same thing was clicked
      state.opponentBattingReport[action.payload.data['data-order']][action.payload.data['data-inning']] = Object.assign({}, state.opponentBattingReport[action.payload.data['data-order']][action.payload.data['data-inning']], { type: null })
    } else {
      state.opponentBattingReport[action.payload.data['data-order']][action.payload.data['data-inning']] = Object.assign({}, state.opponentBattingReport[action.payload.data['data-order']][action.payload.data['data-inning']], { type: action.payload.data['data-hit-type'] })
    }
  }

  if (action.type === 'game.opponent-batter/change-depth') {
    state = Object.assign({}, state)
    state.opponentBattingReport = Object.assign([], state.opponentBattingReport)
    let depth = state.opponentBattingReport[action.payload.data['data-order']][action.payload.data['data-inning']].depth
    if (depth === null) { // nothing selected
      state.opponentBattingReport[action.payload.data['data-order']][action.payload.data['data-inning']] = Object.assign({}, state.opponentBattingReport[action.payload.data['data-order']][action.payload.data['data-inning']], { depth: [action.payload.data['data-min'], action.payload.data['data-max']] })
    } else if (depth[0] === action.payload.data['data-min'] && depth[1] === action.payload.data['data-max']) { // same thing was clicked
      state.opponentBattingReport[action.payload.data['data-order']][action.payload.data['data-inning']] = Object.assign({}, state.opponentBattingReport[action.payload.data['data-order']][action.payload.data['data-inning']], { depth: null })
    } else {
      state.opponentBattingReport[action.payload.data['data-order']][action.payload.data['data-inning']] = Object.assign({}, state.opponentBattingReport[action.payload.data['data-order']][action.payload.data['data-inning']], { depth: [action.payload.data['data-min'], action.payload.data['data-max']] })
    }
  }

  if (action.type === 'game.opponent-batter/change-lane') {
    state = Object.assign({}, state)
    state.opponentBattingReport = Object.assign([], state.opponentBattingReport)
    let lane = state.opponentBattingReport[action.payload.data['data-order']][action.payload.data['data-inning']].lane
    if (lane === null) { // nothing selected
      state.opponentBattingReport[action.payload.data['data-order']][action.payload.data['data-inning']] = Object.assign({}, state.opponentBattingReport[action.payload.data['data-order']][action.payload.data['data-inning']], { lane: action.payload.data['data-lane'] })
    } else if (lane === action.payload.data['data-lane']) { // same thing was clicked
      state.opponentBattingReport[action.payload.data['data-order']][action.payload.data['data-inning']] = Object.assign({}, state.opponentBattingReport[action.payload.data['data-order']][action.payload.data['data-inning']], { lane: null })
    } else {
      state.opponentBattingReport[action.payload.data['data-order']][action.payload.data['data-inning']] = Object.assign({}, state.opponentBattingReport[action.payload.data['data-order']][action.payload.data['data-inning']], { lane: action.payload.data['data-lane'] })
    }
  }

  if (action.type === 'game.opponent/set-number-of-batters') {
    state = Object.assign({}, state)
    let lastBatter = state.opponentBattingOrder[state.opponentBattingOrder.length - 1]
    state.opponentBattingReport.forEach(batter => {
      if (batter.length > state.opponentOrderTurned) state.opponentOrderTurned = batter.length
    })
    if (action.payload.increment) {
      let newBatter = Object.assign({}, GENERIC_OPPOSING_BATTER)
      let newReport = new Array(state.opponentOrderTurned).fill().map(b => Object.assign({}, GENERIC_ATBAT))
      state.opponentBattingOrder.push(newBatter)
      state.opponentBattingReport.push(newReport)
    } else if (!lastBatter.name && !lastBatter.number && state.opponentBattingOrder.length > state.league.minimalRoster) { // CR: Delete the last empty one if u find one?
      state.opponentBattingOrder.pop()
      state.opponentBattingReport.pop()
    }
  }

  if (action.type === 'game/prompt-restart') {
    state = Object.assign({}, state)
    state.prompt = {
      type: 'restart',
      message: 'Are you sure you wish to restart the game? This will irreversibly clear the entire game sheet.'
    }
  }

  if (action.type === 'game/prompt-submit') {
    state = Object.assign({}, state)
    state.prompt = {
      type: 'submit',
      message: 'Are you sure you wish to end and submit the game? This will end the game, stats will be recorded. ' + 
               'This is irreversible. The game will no longer be available for updates and changes.'
    }
  }

  if (action.type === 'game/prompt-cancelled') {
    state = Object.assign({}, state)
    state.prompt = null
  }

  if (action.type === 'game/prompt-confirmed') {
    state = Object.assign({}, state)
    state.prompt = null
  }

  if (action.type === 'game.submit/success') {
    state = Object.assign({}, state)
    state.status = 1
  }

  if (action.type === 'game.submit/error') {
    state = Object.assign({}, state)
    state.prompt = {
      type: 'error',
      message: action.payload
    }
  }

  return state
}
