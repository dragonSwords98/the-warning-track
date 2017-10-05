'use strict'
import moment from 'moment'

import { STATUS_ORDERING, HIT_ORDERING, GENERIC_OPPOSING_BATTER, GENERIC_ATBAT } from '@track/utils/constants'
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
  ourActiveRoster: [],
  ourBattingOrder: [],
  ourFieldingLineup: [],
  opposingBattingOrder: [],
  statusGrid: [], // ours batting order
  radialActive: false,
  hitGrid: [], // ours hitting chart
  scoresheet: [], // ours vs theirs
  gameStatus: 0 // =pre-game, 1 = in-game, 2 = post-game
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
  }

  if (action.type === 'route.game-container/load-game.rejected') {
    state = Object.assign({}, state, INITIAL_STATE)
  }

  /* Radial Selection for Offense Table -> Batter Box */

  if (action.type === 'game.radial-select/toggle') {
    state = Object.assign({}, state)
    if (!state.radialActive) state.radialActive = [action.payload.data["data-inning"], action.payload.data["data-row"]]
    else if (state.radialActive[0] === action.payload.data["data-inning"] && state.radialActive[0] === action.payload.data["data-row"]) {
      state.radialActive = false // TODO: doesn't close
    } else {
      state.radialActive = [action.payload.data["data-inning"], action.payload.data["data-row"]]
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
      state.statusGrid[inning - 1][row] = Object.assign({}, STATUS_ORDERING[statusIndex])

      state.scoresheet.ours.runs[inning - 1] = updateScoresheet('HOME', state.statusGrid[inning - 1])
      state.scoresheet.ours.outs[inning - 1] = updateScoresheet('OUT', state.statusGrid[inning - 1])
    }
    if (layer === 'hit') {
      let hitIndex = HIT_ORDERING.findIndex(hit => hit.name === label)
      state.hitGrid[inning - 1][row] = Object.assign({}, HIT_ORDERING[hitIndex])
    }
    state.radialActive = false
  }

  if (action.type === 'game.hit/change-type') {
    state = Object.assign({}, state)
    const { row, inning } = action.payload.target.dataset
    let hitIndex = HIT_ORDERING.findIndex(hit => hit.name === state.hitGrid[inning - 1][row].name) + 1
    if (hitIndex > HIT_ORDERING.length - 1) {
      hitIndex = 0
    }
    state.hitGrid[inning - 1][row] = Object.assign({}, HIT_ORDERING[hitIndex])
    state.hitGrid[inning - 1][row].disabled = false
  }

  if (action.type === 'game.scoresheet/update') {
    state = Object.assign({}, state)

    // TODO: Please confirm the OUTS are working reasonably properly

    if (action.payload.data.type === 'number') {
      state.scoresheet.theirs.runs[parseInt(action.payload.data["data-inning"]) - 1] = parseInt(action.payload.data.value)
    } else if (action.payload.data.type === 'checkbox' && action.payload.data.checked) {
      state.scoresheet.theirs.outs[parseInt(action.payload.data["data-inning"]) - 1]++
    } else if (action.payload.data.type === 'checkbox' && !action.payload.data.checked) {
      state.scoresheet.theirs.outs[parseInt(action.payload.data["data-inning"]) - 1]--
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
    state.ourFieldingLineup = new Array(action.payload.league.innings + 1).fill(positions)
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
    state.ourFieldingLineup = new Array(state.league.innings + 1).fill(positions)
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
    state.opposingBattingOrder = Object.assign([], state.opposingBattingOrder)
    state.opposingBattingOrder[action.payload.data['data-order']].name = action.payload.data.value
  }

  if (action.type === 'game.opponent-number/change') {
    state = Object.assign({}, state)
    state.opposingBattingOrder[action.payload.data['data-order']].number = parseInt(action.payload.data.value)
  }

  if (action.type === 'game.opponent-batter/change-hit-type') {
    state = Object.assign({}, state)
    state.opposingBattingOrder = Object.assign([], state.opposingBattingOrder)
    state.opposingBattingOrder[action.payload.data['data-order']].atBats[action.payload.data['data-inning']].type = action.payload.data.value
  }

  if (action.type === 'game.opponent-batter/change-depth') {
    state = Object.assign({}, state)
    state.opposingBattingOrder = Object.assign([], state.opposingBattingOrder)
    state.opposingBattingOrder[action.payload.data['data-order']].atBats[action.payload.data['data-inning']].depth = action.payload.data.value
  }

  if (action.type === 'game.opponent-batter/change-lane') {
    state = Object.assign({}, state)
    state.opposingBattingOrder = Object.assign([], state.opposingBattingOrder)
    state.opposingBattingOrder[action.payload.data['data-order']].atBats[action.payload.data['data-inning']].lane = action.payload.data.value
  }

  if (action.type === 'game.opponent/set-number-of-batters') {
    state = Object.assign({}, state)
    let lastBatter = state.opposingBattingOrder[state.opposingBattingOrder.length - 1]
    if (action.payload.increment) {
      let batterInfo = Object.assign({}, GENERIC_OPPOSING_BATTER)
      // CR: Assuming league.innings exists
      batterInfo.atBats = new Array(state.league.innings + 1).fill().map(b => Object.assign({}, GENERIC_ATBAT))
      state.opposingBattingOrder.push(batterInfo) // TODO: INCORRECT
    } else if (!lastBatter.name && !lastBatter.number) { // CR: Delete the last empty one if u find one?
      state.opposingBattingOrder.pop()
    }
  }

  if (action.type === 'game.opponent/set-batting-order') {
    state = Object.assign({}, state)
    state.opposingBattingOrder = action.payload.newOrder
  }

  if (action.type === 'game.opponent/set-batter-info') {
    state = Object.assign({}, state)
    state.opposingBattingOrder[action.payload.index] = Object.assign({}, state.opposingBattingOrder[action.payload.index], action.payload.batter)
  }

  if (action.type === 'game/complete') {
    state = Object.assign({}, state)
    state.status = 1
  }

  return state
}
