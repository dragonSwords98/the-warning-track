'use strict'
import moment from 'moment'

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
  // homeBattingOrder: [],
  // homeFieldingLineup: [],
  // awayBattingOrder: [],
  // awayFieldingLineup: [],
  statusGrid: [], // ours batting order
  scoresheet: [], // ours vs theirs
  // nextHitterPoint: 0, // only ours
  gameStatus: 0 // =pre-game, 1 = in-game, 2 = post-game
}

const OUT_STATUS = {
  name: 'OUT',
  label: 'Out',
  color: 'black'
}
const BENCH_STATUS = {
  name: 'BENCH',
  label: 'Bench',
  color: 'grey'
}
const IN_THE_HOLE_STATUS = {
  name: 'IN_THE_HOLE',
  label: 'Hole',
  color: 'yellow'
}
const ON_DECK_STATUS = {
  name: 'ON_DECK',
  label: 'Deck',
  color: 'orange'
}
const AT_BAT_STATUS = {
  name: 'AT_BAT',
  label: 'Bat',
  color: 'red'
}
const FIRST_STATUS = {
  name: 'FIRST',
  label: 'First',
  color: 'olive'
}
const SECOND_STATUS = {
  name: 'SECOND',
  label: 'Second',
  color: 'green'
}
const THIRD_STATUS = {
  name: 'THIRD',
  label: 'Third',
  color: 'teal'
}
const HOME_STATUS = {
  name: 'HOME',
  label: 'Home',
  color: 'blue'
}

const STATUS_ORDERING = [
  BENCH_STATUS,
  IN_THE_HOLE_STATUS,
  ON_DECK_STATUS,
  AT_BAT_STATUS,
  FIRST_STATUS,
  SECOND_STATUS,
  THIRD_STATUS,
  HOME_STATUS,
  OUT_STATUS
]

const populateStatusGrid = function (activeRosterLength, innings) {
  let array = []
  let row = new Array(innings)
  row.fill(BENCH_STATUS)
  while (activeRosterLength--) array.push(row.slice())
  return array
}

const populateScoresheet = function (innings) {
  let array = new Array(innings)
  array.fill([0, 0])
  return array
}

const updateScoresheet = function (score, statusInning) {
  score = [0, 0]
  statusInning.forEach(g => {
    if (g.name === 'HOME') {
      score[0]++
    }
    if (g.name === 'OUT') {
      score[1]++
    }
  })
  return score
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
    state.statusGrid = populateStatusGrid(state.league.innings, state.ourBattingOrder.length)
    state.scoresheet = {
      ours: populateScoresheet(state.league.innings),
      theirs: populateScoresheet(state.league.innings)
    }

    // if it is not the current inning, it is locked
    state.lockedInnings = Array.from({length:state.league.innings},(v,k)=>k+1)
    state.lockedInnings.splice(state.lockedInnings.indexOf(parseInt(state.currentInning)), 1)
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
    state.scoresheet.ours[inning - 1] = updateScoresheet(state.scoresheet.ours[inning - 1], state.statusGrid[inning - 1])
  }

  if (action.type === 'game.scoresheet/update') {
    state = Object.assign({}, state)

    if (action.payload.data.type === 'number') {
      state.scoresheet.theirs[action.payload.data["data-inning"]][0] = parseInt(action.payload.data.value)
    } else if (action.payload.data.type === 'checkbox') {
      state.scoresheet.theirs[action.payload.data["data-inning"]][1] = +action.payload.data.checked
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

  if (action.type === 'game.inning/start') {
    state = Object.assign({}, state)
    // this action will enbolden important values like lineup for this inning, whose up to bat, which inning is it
    // advance tally scores
  }

  if (action.type === 'game.save/success') {
    state = Object.assign({}, state)
  }

  if (action.type === 'game.save/error') {
    state = Object.assign({}, state)
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
    const positions = action.payload.league.positions.reduce((acc, curr, i) => {
      acc[curr] = ''
      return acc
    }, {})
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

  if (action.type === 'route.game-container/create-game.success') {
    state = Object.assign({}, state, INITIAL_STATE)
  }

  if (action.type === 'route.game-container/create-game.rejected') {
    console.error(action.payload)
  }

  if (action.type === 'create-game.lock-inning/toggle' || action.type === 'game.lock-inning/toggle') {
    state = Object.assign({}, state)
    let index = state.lockedInnings.indexOf(action.payload.inning)
    if (index > -1) {
      state.lockedInnings.splice(index, 1)
    } else {
      state.lockedInnings.push(action.payload.inning)
      state.lockedInnings.sort()
    }
  }
  return state
}
