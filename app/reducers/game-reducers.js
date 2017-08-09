'use strict'
import moment from 'moment'

import { STATUS_ORDERING, GENERIC_OPPOSING_BATTER } from '@track/utils/constants'

// CR: Consider deprecating
import { populateScoresheet, populateStatusGrid, updateScoresheet } from '@track/utils'

const INITIAL_STATE = {
  league: null,
  _id: null,
  ourTeam: null,
  opposingTeam: '',
  diamond: '',
  dateTime: moment().format('YYYY-MM-DD'),
  homeOrAway: 'Away', // or 'Home'
  // innings: 7, // DEFAULT: 7
  // positions: ['C', '1B', '2B', 'SS', '3B', 'LF', 'LR', 'CF', 'RF'],
  // homeRunRule: true,
  // mercyRuns: 7, // or 8 or 5
  // noMercyInningBegin: 5, // or 6 or 7
  // coedRule: 'MMF', // or 'MMMF'
  currentInning: 1, // to emphasis specific off/def lineups
  lockedInnings: [],
  currentFrame: 0, // 0 for top, 1 for bottom
  ourBattingOrder: [],
  ourFieldingLineup: [],
  opposingBattingOrder: [],
  statusGrid: [], // ours batting order
  scoresheet: [], // ours vs theirs
  // nextHitterPoint: 0, // only ours
  gameStatus: 0 // =pre-game, 1 = in-game, 2 = post-game
}

const populatePositions = function(positions) {
  return positions.reduce((acc, curr, i) => {
    acc[curr] = ''
    return acc
  }, {})
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
  
  // if (action.type === 'route.game-container/start-game.initialize') {
  //   let { game } = action.payload
  //   state = Object.assign({}, INITIAL_STATE, state, game)
  //   state.statusGrid = populateStatusGrid(state.league.innings, game.ourBattingOrder.length)
  //   state.scoresheet = populateScoresheet(state.league.innings)
  //   state.gameStatus = 1
  // }

  if (action.type === 'route.game-container/load-game.success') {
    state = Object.assign({}, INITIAL_STATE, state, action.payload.game)
  }
  if (action.type === 'route.game-container/load-league.success') {
    state = Object.assign({}, state)
    state.league = action.payload.league

    // CR: consider deprecating
    if (!state.statusGrid.length) {
      state.statusGrid = populateStatusGrid(state.league.innings, state.ourBattingOrder.length)
    }
    // CR: consider deprecating
    if (!state.scoresheet.ours || !state.scoresheet.theirs) {
      state.scoresheet = {
        ours: populateScoresheet(state.league.innings),
        theirs: populateScoresheet(state.league.innings)
      }
    }
  }

  if (action.type === 'route.game-container/load-game.rejected') {
    state = Object.assign({}, state, INITIAL_STATE)
  }

  if (action.type === 'game.advance-runner/advance') {
    state = Object.assign({}, state)
    const { row, inning } = action.payload.target.dataset
    let statusIndex = STATUS_ORDERING.indexOf(state.statusGrid[inning - 1][row]) + 1
    if (statusIndex > STATUS_ORDERING.length - 1) {
      statusIndex = 0
    }
    state.statusGrid[inning - 1][row] = STATUS_ORDERING[statusIndex]

    state.scoresheet.ours.runs[inning - 1] = updateScoresheet('HOME', state.statusGrid[inning - 1])
    state.scoresheet.ours.outs[inning - 1] = updateScoresheet('OUT', state.statusGrid[inning - 1])
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

  if (action.type === 'game.advance-batter-runner/inning-over') {
    state = Object.assign({}, state)
    // freeze this inning, unfreeze the next inning, set the next batter as at-bat
  }

  // if (action.type === 'game.opponent-action/run') {
  //   state = Object.assign({}, state)
  //   if (action.payload.whose === 'theirs') {
  //     state.scoresheet[state.currentInning].theirs++
  //   }
  //   if (action.payload.whose === 'ours') {
  //     state.scoresheet[state.currentInning].ours++
  //   }
  // }

  // if (action.type === 'game.opponent-action/out') {
  //   state = Object.assign({}, state)
  //   if (action.payload.whose === 'theirs') {
  //     state.scoresheet[state.currentInning].theirOuts++
  //   }
  //   if (action.payload.whose === 'ours') {
  //     state.scoresheet[state.currentInning].ourOuts++
  //   }
  // }

  // if (action.type === 'game.inning/start') {
  //   state = Object.assign({}, state)
  //   // this action will enbolden important values like lineup for this inning, whose up to bat, which inning is it
  //   // advance tally scores
  // }

  // if (action.type === 'game.save/success') {
  //   state = Object.assign({}, state)
  // }

  // if (action.type === 'game.save/error') {
  //   state = Object.assign({}, state)
  // }

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

    // TODO: warn/prompt the user when they change league again bcuz they will lose all their work -_-
  }

  // if (action.type === 'create-game.select-team/set') {
  //   state = Object.assign({}, state)
  //   state.ourTeam = action.payload.team
  //   state.ourBattingOrder = Object.assign({}, action.payload.roster)
  //   state.ourFieldingLineup = Object.assign({}, action.payload.roster) //TODO: should be by inning
  // }

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

  if (action.type === 'create-game.batting-order/change') {
    state = Object.assign({}, state)
    state.ourBattingOrder = action.payload.newOrder
  }

  if (action.type === 'create-game.fielding-lineup/change') {
    state = Object.assign({}, state)
    state.ourFieldingLineup[action.payload.inning] = Object.assign({}, state.ourFieldingLineup[action.payload.inning], {
      [action.payload.position]: action.payload.value
    })

    state.ourFieldingLineup = state.ourFieldingLineup.map(i => {
      if (!i[action.payload.position]) {
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

  if (action.type === 'route.game-container/create-game.success') {
    state = Object.assign({}, state, INITIAL_STATE)
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
  if (action.type === 'game.opponent/set-number-of-batters') {
    state = Object.assign({}, state)
    if (action.payload.increment) {
      state.opposingBattingOrder.push(Object.assign({}, GENERIC_OPPOSING_BATTER))
    } else {
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

  /**
    let opposingBattingOrder = [
      { name: 'Anonymous Chan', number: 12,
        hits: [
          { type: 'single', depth: 4, lane: 'LLF'},
          { type: 'single', depth: 5, lane: 'LF'}
        ],
        attempts: [
          { type: 'grounder', depth: 2, lane: 'FR'}
          { type: 'liner', depth: 5, lane: 'FL'}
          { type: 'flier', depth: 4, lane: 'FL'}
        ]
      },
      ...
    ]
    depths: 0 - 10
    lanes: FB, FL, LLF, LF, CLF, CF, CRF, RF, RRF, FR

    attempts are a scouting report warning that the batter attempted to hit a certain direction but did not end up attacking this zone with their actual hit/out
  */


  return state
}
