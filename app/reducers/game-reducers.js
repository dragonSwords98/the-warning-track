'use strict'
import moment from 'moment'

const INITIAL_STATE = {
  leagueId: 'NL',
  gameId: null,
  teamId: 0,
  opposingTeam: '',
  location: '',
  datetime: moment(),
  homeOrAway: 'Away', // or 'Away'
  innings: 7, // or 8
  positions: ['C', '1B', '2B', 'SS', '3B', 'LF', 'LR', 'CF', 'RF'],
  homeRunRule: true,
  mercyRuns: 7, // or 8 or 5
  noMercyInningBegin: 5, // or 6 or 7
  coedRule: 'MMF', // or 'MMMF'
  currentInning: 1, // to emphasis specific off/def lineups
  lockedInnings: [],
  currentFrame: 0, // 0 for top, 1 for bottom
  homeBattingOrder: [],
  homeFieldingLineup: [],
  homeEarnedRuns: 0,
  awayBattingOrder: [],
  awayFieldingLineup: [],
  awayEarnedRuns: 0
}

export default function gameReducers(state = INITIAL_STATE, action) {
  if (action.type === 'route.game-container/load-game') {
    state = Object.assign({}, state, INITIAL_STATE)
    state.gameId = action.payload.gameId
    state.teamId = action.payload.teamId
    return state
  }
  if (action.type === 'route.game-container/destroy') {
    state = Object.assign({}, state)
    state = null
    return state
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
  if (action.type === 'create-game.lock-inning/toggle') {
    console.log(action.payload.inning)
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
