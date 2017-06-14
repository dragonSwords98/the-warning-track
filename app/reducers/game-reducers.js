'use strict'
import moment from 'moment'

const INITIAL_STATE = {
  leagueId: 'NL',
  gameId: null,
  teamId: 0,
  opposingTeam: '',
  location: '',
  datetime: moment(),
  homeOrAway: 'Away', // or 'Home'
  innings: 7, // or 8
  positions: ['C', '1B', '2B', 'SS', '3B', 'LF', 'LR', 'CF', 'RF'],
  homeRunRule: true,
  mercyRuns: 7, // or 8 or 5
  noMercyInningBegin: 5, // or 6 or 7
  coedRule: 'MMF', // or 'MMMF'
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
  nextHitterPoint: 0, // only ours
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
  var array = [], row = new Array(innings);
  row.fill(BENCH_STATUS)
  while (activeRosterLength--) array.push(row.slice());
  return array;
}

// Future features: Pinch runner, designated pinch runner, scouting reports on hits
// Rotating co-ed roles

export default function gameReducers(state = INITIAL_STATE, action) {

  if (action.type === 'route.game-container/start-game') {
    state = Object.assign({}, state, INITIAL_STATE)
    state.gameId = action.payload.gameId
    state.teamId = action.payload.teamId
    state.battingOrder = action.payload.battingOrder
    // state.statusGrid = populateStatusGrid(state.innings, state.ourBattingOrder.length)
    state.statusGrid = populateStatusGrid(state.innings, action.payload.battingOrder.length)
    state.gameStatus = 1
    return state

  }
  // if (action.type === 'route.game-container/load-game') {
  //   state = Object.assign({}, state, INITIAL_STATE)
  //   state.gameId = action.payload.gameId
  //   state.teamId = action.payload.teamId
  //   return state
  // }
  if (action.type === 'route.game-container/destroy') {
    state = Object.assign({}, state)
    state = null
    return state
  }

  if (action.type === 'game.advance-runner/advance') {
    state = Object.assign({}, state)
    const { row, inning } = action.payload.target.dataset
    let statusIndex = STATUS_ORDERING.indexOf(state.statusGrid[inning-1][row]) + 1
    if (statusIndex > STATUS_ORDERING.length - 1) {
      statusIndex = 0
    }
    state.statusGrid[inning-1][row] = STATUS_ORDERING[statusIndex]
    return state
  }

  // if (action.type ==='game.advance-batter-runner/advance') {
  //   // the batter/runner is immediately out (from a different touch event), this will shift
  //   // batters and runners accordingly, may end the inning

  //   state = Object.assign({}, state)
  //   const { row, inning } = action.payload
  //   // action.payload.row action.payload.inning

  //   state.statusGrid[row][inning] = FIRST_STATUS // action.payload.base will determine where the batter went

  //   if (++state.scoresheet[inning].outs > 2) {
  //     // inning is OVER
  //   } else {
  //     // advance the order
  //     let onDeckIndex = nextHitterPoint + 1,
  //         inHoleIndex = nextHitterPoint + 2
  //     if (nextHitterPoint + 1 > ourBattingOrder.length) {
  //       onDeckIndex = 0
  //       inHoleIndex = 1
  //     } else if (nextHitterPoint + 2 > ourBattingOrder.length) {
  //       onDeckIndex = nextHitterPoint + 1
  //       inHoleIndex = 0
  //     }
  //     state.statusGrid[nextHitterPoint][inning] = AT_BAT_STATUS
  //     state.statusGrid[onDeckIndex][inning] = ON_DECK_STATUS
  //     state.statusGrid[inHoleIndex][inning] = IN_THE_HOLE_STATUS
  //     nextHitterPoint++
  //   }
  // }

  // if (action.type ==='game.advance-runner/advance') {

  //   // dispatch({ type: 'route.game-container/advanceBatterRunner', payload: { event: event, data: data }})


  //   // by advancing a batter, the next at the plate may be affected
  //   // by advancing a batter to 'out' status, this may end the inning automatically,
  //   // or simply advance next batter to the plate

  //   state = Object.assign({}, state)
  //   const { row, inning } = action.payload
  //   // action.payload.row action.payload.inning

  //   state.statusGrid[row][inning] = HOME_STATUS // action.payload.base will determine where the batter went
  // }

  if (action.type ==='game.advance-batter-runner/inning-over') {
    state = Object.assign({}, state)
    // freeze this inning, unfreeze the next inning, set the next batter as at-bat
  }

  if (action.type ==='game.opponent-action/run') {
    state = Object.assign({}, state)
    if (action.payload.whose === 'theirs') {
      state.scoresheet[currentInning].theirs++
    }
    if (action.payload.whose === 'ours') {
      state.scoresheet[currentInning].ours++
    }
  }

  if (action.type ==='game.opponent-action/out') {
    state = Object.assign({}, state)
    if (action.payload.whose === 'theirs') {
      state.scoresheet[currentInning].theirOuts++
    }
    if (action.payload.whose === 'ours') {
      state.scoresheet[currentInning].ourOuts++
    }
  }

  if (action.type ==='game.inning/start') {
    state = Object.assign({}, state)
    // this action will enbolden important values like lineup for this inning, whose up to bat, which inning is it
    // advance tally scores
  }

  if (action.type === 'create-game.get-league-rules/received') {
    state = Object.assign({}, state)
    state.innings = action.payload.innings
    state.positions = action.payload.positions
    state.homeRunRule = action.payload.homeRunRule
    state.mercyRuns = action.payload.mercyRuns
    state.noMercyInningBegin = action.payload.noMercyInningBegin
    state.coedRule = action.payload.coedRule
    return state
  }
  if (action.type === 'create-game.home-or-away/set') {
    state = Object.assign({}, state)
    state.homeOrAway = action.payload.isHome ? 'Home' : 'Away'
    return state
  }
  if (action.type === 'create-game.lock-inning/toggle' || action.type === 'game.lock-inning/toggle') {
    state = Object.assign({}, state)
    let index = state.lockedInnings.indexOf(action.payload.inning)
    if (index > -1) {
      state.lockedInnings.splice(index, 1)
    } else {
      state.lockedInnings.push(action.payload.inning)
    }
    return state
  }
  return state
}


const OFFENSE_STATE = {
  battingOrder: [] // array in order from first batter to last batter without regard to inning, the current inning before disabling will indicate which inning they fall under
  // e.g. [ HOME, HOME, OUT, THIRD, SECOND, ATBAT, DECK, HOLE, HOLE ...  ], this will populate with each new inning
}

const DEFENSE_STATE = {
  lineup: null // structure should be array of object => e.g. [ ['bl98', 'sl52', 'cl6', ...], [...], ...], strict order ( CR, 1B, 2B, SS, 3B, LF, CF, RF, LR, RR )
}
