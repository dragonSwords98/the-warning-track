// stats.js
const moment = require('moment')
const mongo = require('mongodb')

const LEGAL_HITS = [
  'SINGLE_HIT',
  'DOUBLE_HIT',
  'TRIPLE_HIT',
  'HOME_RUN_HIT',
]

// const INITIAL_STATE = {
//   league: null,
//   _id: null,
//   ourTeam: null,
//   opposingTeam: '',
//   diamond: null,
//   dateTime: moment().format('YYYY-MM-DD'),
//   homeOrAway: 'Away', // or 'Home'
//   currentInning: 1, // to emphasis specific off/def lineups
//   lockedInnings: [],
//   currentFrame: 0, // 0 for top, 1 for bottom
//   ourActiveRoster: [],
//   ourBattingOrder: [],
//   ourFieldingLineup: [],
//   opposingBattingOrder: [],
//   statusGrid: [], // ours batting order
//   radialActive: false,
//   hitGrid: [], // ours hitting chart
//   scoresheet: [], // ours vs theirs
//   gameStatus: 0 // =pre-game, 1 = in-game, 2 = post-game
// }

const PLAYER_STATS_OBJECT_SINGLE_SEASON = {
  offense: {
    G: 0,
    AB: 0,
    R: 0,
    H: 0, // popups onto base = H - LD - GD - HR
    LD: 0, // line drives
    GD: 0, // grounders
    2B: 0,
    3B: 0,
    HR: 0,
    RBI: 0,
    BB: 0,
    SO: 0,
    PO: 0, // pop outs
    GO: 0, // ground outs
    SF: 0
  },
  defense:
    { IP: 0 } // TODO: actual defense stats
  // [
    // {
    //   Pos: "C",
    //   IP: 0,
    //   Ch: 0,
    //   PO: 0,
    //   A: 0,
    //   E: 0
    // }, {
    //   Pos: "P",
    //   IP: 0,
    //   Ch: 0,
    //   PO: 0,
    //   A: 0,
    //   E: 0
    // }, {
    //   Pos: "1B",
    //   IP: 0,
    //   Ch: 0,
    //   PO: 0,
    //   A: 0,
    //   E: 0
    // }, {
    //   Pos: "2B",
    //   IP: 0,
    //   Ch: 0,
    //   PO: 0,
    //   A: 0,
    //   E: 0
    // }, {
    //   Pos: "SS",
    //   IP: 0,
    //   Ch: 0,
    //   PO: 0,
    //   A: 0,
    //   E: 0
    // }, {
    //   Pos: "3B",
    //   IP: 0,
    //   Ch: 0,
    //   PO: 0,
    //   A: 0,
    //   E: 0
    // }, {
    //   Pos: "LF",
    //   IP: 0,
    //   Ch: 0,
    //   PO: 0,
    //   A: 0,
    //   E: 0
    // }, {
    //   Pos: "LR",
    //   IP: 0,
    //   Ch: 0,
    //   PO: 0,
    //   A: 0,
    //   E: 0
    // }, {
    //   Pos: "CF",
    //   IP: 0,
    //   Ch: 0,
    //   PO: 0,
    //   A: 0,
    //   E: 0
    // }, {
    //   Pos: "RR",
    //   IP: 0,
    //   Ch: 0,
    //   PO: 0,
    //   A: 0,
    //   E: 0
    // }, {
    //   Pos: "RF",
    //   IP: 0,
    //   Ch: 0,
    //   PO: 0,
    //   A: 0,
    //   E: 0
    // }
  // ]
}

const TEAM_STATS_OBJECT_SINGLE_SEASON = {
  games: 0,
  wins: 0,
  losses: 0,
  ties: 0,
  biggestLead: 0,
  farthestDeficit: 0,
  currentStreak: 0,
  longestWinStreak: 0,
  longestLosingStreak: 0,
  mostRunsAllowed: 0,
  mostRunsScored: 0,
  shutouts: 0,
  shutoutsByOpponent: 0,
  walkoffWins: 0,
  walkoffLosses: 0
}

// WARNING: This is irreversible at this time
exports.commitGame = function (req, res) {
  const game = req.body

  // VALIDATE GAME OBJECT IS A LEGAL COMPLETED GAME, not a duplicate stat measurement, and not an unfinished game

  // CR: If we're editting a previously COMPLETED game, then do not use the ACCUMULATORS
  // Previously completed games cannot update the stats again or it will be incorrect.
  // Unless we pull back the legacy copy of this game, subtract the stats out and readd with new figures

  let TeamSeasonStats // TODO: Get Object from MongoDB
  accumulateTeamSeasonStatsAfterGame(game, TeamSeasonStats)

  game.ourActiveRoster.forEach(player => {
    let PlayerSeasonStats // TODO: Get Object from MongoDB
    accumulatePlayerSeasonStatsAfterGame(game, player, PlayerSeasonStats)    
  })

  // CR: We don't do the opponent's stats. They should have their own team instances to avoid overlap

  // game.statusGrid
  // game.ourActiveRoster
  // game.ourBattingOrder
  // game.hitGrid
  // game.scoresheet
  // game.ourTeam
  // game.opposingTeam
  // game.league
  // game.gameStatus
  
}

const accumulateTeamSeasonStatsAfterGame = function (game, TeamSeasonStats) {
  if (!TeamSeasonStats) TeamSeasonStats = Object.assign({}, TEAM_STATS_OBJECT_SINGLE_SEASON)

  TeamSeasonStats.games++

  let ourRuns = game.scoresheet.ours.runs.reduce((sum, value) => sum + value, 0)
  let theirRuns = game.scoresheet.theirs.runs.reduce((sum, value) => sum + value, 0)
  if (ourRuns > theirRuns) TeamSeasonStats.wins++
  else if (ourRuns < theirRuns) TeamSeasonStats.losses++
  else TeamSeasonStats.ties++
  
  // TODO: find biggest lead and deficit in this game, if any, check with records
  // biggestLead: 0,
  // farthestDeficit: 0,

  // TODO: evaluate current streak, determine if recent win/loss/tie affects longest standing streaks
  // longestWinStreak: 0,
  // longestLosingStreak: 0,

  if (ourRuns > TeamSeasonStats.mostRunsScored) TeamSeasonStats.mostRunsScored = ourRuns
  if (theirRuns > TeamSeasonStats.mostRunsAllowed) TeamSeasonStats.mostRunsAllowed = theirRuns

  if (theirRuns <= 0) TeamSeasonStats.shutouts++
  if (ourRuns <= 0) TeamSeasonStats.shutoutsByOpponent++

  // TODO: evaluate score after second last inning, see if it was a walkoff
  // walkoffWins: 0,
  // walkoffLosses: 0

  return TeamSeasonStats
}

const accumulatePlayerSeasonStatsAfterGame = function (game, player, PlayerSeasonStats) {
  if (!PlayerSeasonStats) PlayerSeasonStats = Object.assign({}, PLAYER_STATS_OBJECT_SINGLE_SEASON)

  let batIndex = game.ourBattingOrder.findIndex(batter => batter === player.id) // CR: OR player...

  PlayerSeasonStats.offense.G++
  PlayerSeasonStats.offense.AB += game.statusGrid.reduce((acc, inning) => inning[batIndex].name !== 'BENCH' ? acc++ : acc, 0)
  PlayerSeasonStats.offense.R += game.statusGrid.reduce((acc, inning) => inning[batIndex].name === 'HOME' ? acc++ : acc, 0)
  
  PlayerSeasonStats.offense.H += game.hitGrid.reduce((acc, inning) => LEGAL_HITS.includes(inning[batIndex].name) ? acc++ : acc, 0)
  PlayerSeasonStats.offense.2B += game.hitGrid.reduce((acc, inning) => inning[batIndex].name === 'DOUBLE_HIT' ? acc++ : acc, 0)
  PlayerSeasonStats.offense.3B += game.hitGrid.reduce((acc, inning) => inning[batIndex].name === 'TRIPLE_HIT' ? acc++ : acc, 0)
  PlayerSeasonStats.offense.HR += game.hitGrid.reduce((acc, inning) => inning[batIndex].name === 'HOME_RUN_HIT' ? acc++ : acc, 0)

  // RBI: 0,
  // BB: 0,

  // CR: This is not the only occasion of strike out, if one swung three times and the third one was caught or fouled out, that's still a SO
  PlayerSeasonStats.offense.SO += game.hitGrid.reduce((acc, inning) => inning[batIndex].name === 'STRIKE_OUT' ? acc++ : acc, 0)

  // SF: 0 // must be an OUT from HIT_ORDERING where the runners ahead advanced a base/or got home

  // CR: for now, just count total innings played regardless of position
  PlayerSeasonStats.defense.IP += game.ourFieldingLineup.reduce((acc, inning) => acc + inning.reduce((acc, position) => position === player.id ? acc++ : acc, 0))  // CR: OR player...

  // TODO: Defensive statistics
  // defense: [
  //   {
  //     Pos: "C",
  //     IP: 0,
  //     Ch: 0,
  //     PO: 0,
  //     A: 0,
  //     E: 0
  //   }, {
  //     Pos: "P",
  //     IP: 0,
  //     Ch: 0,
  //     PO: 0,
  //     A: 0,
  //     E: 0
  //   }, {
    // ...
  return PlayerSeasonStats
}